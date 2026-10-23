import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { SavedSeries } from '../../core/series/saved-series.model';
import { SeriesStoreService } from '../../core/series/series-store.service';
import { SeriesList } from './series-list';

function record(overrides: Partial<SavedSeries> = {}): SavedSeries {
  return {
    id: 'series-1',
    name: 'Poland total',
    note: 'Watching the labour market',
    filters: { geo: 'PL', sex: 'T' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T10:30:00.000Z',
    ...overrides,
  };
}

function configure(series: SavedSeries[], warning: string | null = null): void {
  TestBed.configureTestingModule({
    imports: [SeriesList],
    providers: [
      provideRouter([]),
      {
        provide: SeriesStoreService,
        useValue: {
          series: signal(series),
          loadWarning: signal(warning),
        },
      },
    ],
  });
}

describe('SeriesList', () => {
  it('shows the empty state when no series are saved', async () => {
    configure([]);
    const fixture = TestBed.createComponent(SeriesList);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')?.textContent).toContain('No saved series yet');
  });

  it('renders saved series details and a warning', async () => {
    configure([record()], 'Some saved series were invalid.');
    const fixture = TestBed.createComponent(SeriesList);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert.warning')?.textContent).toContain('invalid');
    expect(compiled.querySelector('.series-card h2')?.textContent).toContain('Poland total');
    expect(compiled.querySelector('.series-card')?.textContent).toContain('Poland');
    expect(compiled.querySelector('.series-card')?.textContent).toContain('Total');
    expect(compiled.querySelector('.series-card')?.textContent).toContain('Watching the labour market');
  });
});
