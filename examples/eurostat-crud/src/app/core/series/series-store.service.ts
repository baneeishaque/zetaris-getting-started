import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import {
  GEO_CODES,
  SEX_CODES,
  type GeoCode,
  type SavedSeries,
  type SavedSeriesInput,
  type SexCode,
} from './saved-series.model';

const STORAGE_KEY = 'eurostat-crud.saved-series.v1';
const CORRUPT_KEY = 'eurostat-crud.saved-series.v1.corrupt';
const STORAGE_VERSION = 1;

interface StoredEnvelope {
  version: number;
  items: unknown[];
}

export class SeriesValidationError extends Error {
  constructor(message: string, readonly field?: 'name' | 'note' | 'filters') {
    super(message);
    this.name = 'SeriesValidationError';
  }
}

export class SeriesStorageError extends Error {
  constructor(message: string, override readonly cause?: unknown) {
    super(message);
    this.name = 'SeriesStorageError';
  }
}

@Injectable({ providedIn: 'root' })
export class SeriesStoreService {
  private readonly destroyRef = inject(DestroyRef);

  readonly loadWarning = signal<string | null>(null);
  private readonly _series = signal<SavedSeries[]>(this.load());
  readonly series = this._series.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      const onStorage = (event: StorageEvent): void => {
        if (event.key === STORAGE_KEY) {
          this._series.set(this.load());
        }
      };

      window.addEventListener('storage', onStorage);
      this.destroyRef.onDestroy(() => window.removeEventListener('storage', onStorage));
    }
  }

  create(input: SavedSeriesInput): SavedSeries {
    const normalized = this.validateInput(input);
    const now = new Date().toISOString();
    const record: SavedSeries = {
      id: crypto.randomUUID(),
      ...normalized,
      createdAt: now,
      updatedAt: now,
    };
    const next = [...this._series(), record];

    this.persist(next);
    this._series.set(this.sort(next));
    return record;
  }

  update(id: string, input: SavedSeriesInput): SavedSeries | undefined {
    const existing = this._series().find((item) => item.id === id);
    if (!existing) {
      return undefined;
    }

    const normalized = this.validateInput(input);
    const updated: SavedSeries = {
      ...existing,
      ...normalized,
      updatedAt: new Date().toISOString(),
    };
    const next = this._series().map((item) => (item.id === id ? updated : item));

    this.persist(next);
    this._series.set(this.sort(next));
    return updated;
  }

  delete(id: string): boolean {
    const current = this._series();
    const next = current.filter((item) => item.id !== id);

    if (next.length === current.length) {
      return false;
    }

    this.persist(next);
    this._series.set(this.sort(next));
    return true;
  }

  private load(): SavedSeries[] {
    this.loadWarning.set(null);
    const raw = this.readRaw();

    if (!raw) {
      return [];
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      this.backupCorrupt(raw);
      this.loadWarning.set('Saved series data was corrupt. The original value was backed up.');
      return [];
    }

    if (!this.isEnvelope(parsed)) {
      this.backupCorrupt(raw);
      this.loadWarning.set('Saved series data had an unexpected shape. The original value was backed up.');
      return [];
    }

    const items: SavedSeries[] = [];
    let dropped = false;

    for (const candidate of parsed.items) {
      const record = this.parseStored(candidate);

      if (record) {
        items.push(record);
      } else {
        dropped = true;
      }
    }

    if (dropped) {
      this.loadWarning.set('Some saved series were invalid and were ignored.');
    }

    return this.sort(items);
  }

  private readRaw(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      this.loadWarning.set('Saved series could not be read from this browser.');
      return null;
    }
  }

  private backupCorrupt(raw: string): void {
    try {
      localStorage.setItem(CORRUPT_KEY, raw);
    } catch {
      // The warning still explains that the original could not be loaded.
    }
  }

  private persist(items: SavedSeries[]): void {
    const envelope: StoredEnvelope = { version: STORAGE_VERSION, items };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    } catch (error) {
      throw new SeriesStorageError('Could not save saved series in this browser.', error);
    }
  }

  private validateInput(input: SavedSeriesInput): Omit<SavedSeries, 'id' | 'createdAt' | 'updatedAt'> {
    if (!input || typeof input !== 'object') {
      throw new SeriesValidationError('Saved series input is missing.', 'filters');
    }

    const name = typeof input.name === 'string' ? input.name.trim() : '';
    if (name.length < 1 || name.length > 80) {
      throw new SeriesValidationError('Name must be between 1 and 80 characters.', 'name');
    }

    const note = typeof input.note === 'string' ? input.note.trim() : '';
    if (note.length > 2000) {
      throw new SeriesValidationError('Note must be 2,000 characters or fewer.', 'note');
    }

    const filters = input.filters;
    if (!filters || typeof filters !== 'object') {
      throw new SeriesValidationError('Choose a country and sex.', 'filters');
    }

    if (!this.isGeo(filters.geo) || !this.isSex(filters.sex)) {
      throw new SeriesValidationError('Choose a supported country and sex.', 'filters');
    }

    return {
      name,
      note,
      filters: {
        geo: filters.geo,
        sex: filters.sex,
      },
    };
  }

  private parseStored(value: unknown): SavedSeries | null {
    if (!this.isRecord(value)) {
      return null;
    }

    const id = value['id'];
    const name = value['name'];
    const note = value['note'];
    const filters = value['filters'];
    const createdAt = value['createdAt'];
    const updatedAt = value['updatedAt'];

    if (typeof id !== 'string' || id.length === 0) {
      return null;
    }

    if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 80) {
      return null;
    }

    if (typeof note !== 'string' || note.trim().length > 2000) {
      return null;
    }

    if (!this.isRecord(filters) || !this.isGeo(filters['geo']) || !this.isSex(filters['sex'])) {
      return null;
    }

    if (!this.isTimestamp(createdAt) || !this.isTimestamp(updatedAt)) {
      return null;
    }

    return {
      id,
      name: name.trim(),
      note: note.trim(),
      filters: {
        geo: filters['geo'],
        sex: filters['sex'],
      },
      createdAt,
      updatedAt,
    };
  }

  private isEnvelope(value: unknown): value is StoredEnvelope {
    return (
      this.isRecord(value) &&
      value['version'] === STORAGE_VERSION &&
      Array.isArray(value['items'])
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isGeo(value: unknown): value is GeoCode {
    return typeof value === 'string' && (GEO_CODES as readonly string[]).includes(value);
  }

  private isSex(value: unknown): value is SexCode {
    return typeof value === 'string' && (SEX_CODES as readonly string[]).includes(value);
  }

  private isTimestamp(value: unknown): value is string {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value));
  }

  private sort(items: SavedSeries[]): SavedSeries[] {
    return [...items].sort(
      (left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.name.localeCompare(right.name),
    );
  }
}
