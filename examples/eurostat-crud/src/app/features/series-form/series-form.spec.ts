import { signal, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import type { SavedSeries, SavedSeriesInput } from '../../core/series/saved-series.model';
import { SeriesStoreService } from '../../core/series/series-store.service';
import { SeriesForm } from './series-form';

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

interface StoreMock {
  series: WritableSignal<SavedSeries[]>;
  loadWarning: WritableSignal<string | null>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

function configure(
  series: SavedSeries[],
  params: Record<string, string> = {},
): { store: StoreMock; router: Router } {
  const created = record();
  const store: StoreMock = {
    series: signal(series),
    loadWarning: signal(null),
    create: vi.fn((input: SavedSeriesInput) => ({ ...created, ...input })),
    update: vi.fn((id: string, input: SavedSeriesInput) => ({ ...record({ id }), ...input })),
  };

  TestBed.configureTestingModule({
    imports: [SeriesForm],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap(params) } },
      },
      { provide: SeriesStoreService, useValue: store },
    ],
  });

  return { store, router: TestBed.inject(Router) };
}

describe('SeriesForm', () => {
  it('creates a trimmed series and navigates to its detail page', async () => {
    const { store, router } = configure([]);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(SeriesForm);
    fixture.detectChanges();

    fixture.componentInstance.form.setValue({
      name: '  Poland total  ',
      geo: 'PL',
      sex: 'T',
      note: '  Watch this  ',
    });
    fixture.componentInstance.submit();
    await fixture.whenStable();

    expect(store.create).toHaveBeenCalledWith({
      name: 'Poland total',
      note: 'Watch this',
      filters: { geo: 'PL', sex: 'T' },
    });
    expect(navigate).toHaveBeenCalledWith(['/series', 'series-1']);
  });

  it('does not submit an invalid form', () => {
    const { store } = configure([]);
    const fixture = TestBed.createComponent(SeriesForm);
    fixture.detectChanges();

    fixture.componentInstance.form.setValue({ name: '   ', geo: 'PL', sex: 'T', note: '' });
    fixture.componentInstance.submit();

    expect(store.create).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.controls.name.touched).toBe(true);
  });

  it('loads an existing series into the edit form', () => {
    const existing = record();
    const { store } = configure([existing], { id: existing.id });
    const fixture = TestBed.createComponent(SeriesForm);
    fixture.detectChanges();

    expect(fixture.componentInstance.editing()).toBe(true);
    expect(fixture.componentInstance.form.getRawValue()).toEqual({
      name: 'Poland total',
      geo: 'PL',
      sex: 'T',
      note: 'A note',
    });
    expect(store.create).not.toHaveBeenCalled();
  });
});
