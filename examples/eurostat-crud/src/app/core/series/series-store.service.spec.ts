import { TestBed } from '@angular/core/testing';
import type { SavedSeries } from './saved-series.model';
import { SeriesStoreService, SeriesValidationError } from './series-store.service';

const STORAGE_KEY = 'eurostat-crud.saved-series.v1';
const CORRUPT_KEY = 'eurostat-crud.saved-series.v1.corrupt';

function record(overrides: Partial<SavedSeries> = {}): SavedSeries {
  return {
    id: 'series-1',
    name: 'Poland total',
    note: 'A note',
    filters: { geo: 'PL', sex: 'T' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function createService(): SeriesStoreService {
  TestBed.configureTestingModule({});
  return TestBed.inject(SeriesStoreService);
}

describe('SeriesStoreService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a trimmed record and persists the versioned envelope', () => {
    const service = createService();

    const created = service.create({
      name: '  Poland total  ',
      note: '  Watch this series  ',
      filters: { geo: 'PL', sex: 'T' },
    });

    expect(created.name).toBe('Poland total');
    expect(created.note).toBe('Watch this series');
    expect(created.id).toBeTruthy();
    expect(service.series()).toHaveLength(1);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
      version: number;
      items: SavedSeries[];
    };
    expect(stored.version).toBe(1);
    expect(stored.items[0]?.name).toBe('Poland total');
  });

  it('updates a record in place while preserving its id and creation time', () => {
    const service = createService();
    const created = service.create({
      name: 'Original',
      note: '',
      filters: { geo: 'PL', sex: 'T' },
    });

    const updated = service.update(created.id, {
      name: 'Renamed',
      note: 'Updated note',
      filters: { geo: 'PL', sex: 'T' },
    });

    expect(updated?.id).toBe(created.id);
    expect(updated?.createdAt).toBe(created.createdAt);
    expect(updated?.name).toBe('Renamed');
    expect(updated?.filters).toEqual({ geo: 'PL', sex: 'T' });
    expect(service.series()).toHaveLength(1);
    expect(service.series()[0]?.name).toBe('Renamed');
  });

  it('deletes an existing record and reports missing ids', () => {
    const service = createService();
    const created = service.create({
      name: 'Delete me',
      note: '',
      filters: { geo: 'PL', sex: 'T' },
    });

    expect(service.delete(created.id)).toBe(true);
    expect(service.series()).toHaveLength(0);
    expect(service.delete('missing')).toBe(false);
  });

  it('loads valid records and drops invalid ones with a warning', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        items: [
          record(),
          record({ id: 'bad-geo', filters: { geo: 'XX' as 'PL', sex: 'T' } }),
          record({ id: 'bad-name', name: ' ' }),
        ],
      }),
    );

    const service = createService();

    expect(service.series()).toHaveLength(1);
    expect(service.series()[0]?.id).toBe('series-1');
    expect(service.loadWarning()).toContain('invalid');
  });

  it('backs up corrupt JSON and starts empty with a warning', () => {
    localStorage.setItem(STORAGE_KEY, '{');

    const service = createService();

    expect(service.series()).toHaveLength(0);
    expect(service.loadWarning()).toContain('corrupt');
    expect(localStorage.getItem(CORRUPT_KEY)).toBe('{');
  });

  it('rejects invalid input before writing', () => {
    const service = createService();

    expect(() =>
      service.create({ name: '   ', note: '', filters: { geo: 'PL', sex: 'T' } }),
    ).toThrow(SeriesValidationError);

    expect(() =>
      service.create({ name: 'Valid', note: 'x'.repeat(2001), filters: { geo: 'PL', sex: 'T' } }),
    ).toThrow(SeriesValidationError);

    expect(() =>
      service.create({
        name: 'Valid',
        note: '',
        filters: { geo: 'XX' as 'PL', sex: 'T' },
      }),
    ).toThrow(SeriesValidationError);

    expect(service.series()).toHaveLength(0);
  });

  it('sorts records by most recently updated first', () => {
    vi.useFakeTimers();
    const service = createService();

    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    service.create({ name: 'Older', note: '', filters: { geo: 'PL', sex: 'T' } });

    vi.setSystemTime(new Date('2026-01-01T00:00:01.000Z'));
    service.create({ name: 'Newer', note: '', filters: { geo: 'PL', sex: 'T' } });

    expect(service.series().map((item) => item.name)).toEqual(['Newer', 'Older']);
  });
});
