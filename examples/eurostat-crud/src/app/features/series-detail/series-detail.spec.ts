import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import type { SavedSeries, SeriesData } from '../../core/series/saved-series.model';
import { SeriesStoreService } from '../../core/series/series-store.service';
import { ZetarisService } from '../../core/zetaris/zetaris.service';
import { SeriesDetail } from './series-detail';

function record(): SavedSeries {
  return {
    id: 'series-1',
    name: 'Poland total',
    note: 'A note',
    filters: { geo: 'PL', sex: 'T' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  };
}

function seriesData(count = 30): SeriesData {
  return {
    datasetLabel: 'Unemployment by sex and age - monthly data',
    source: 'ESTAT',
    updated: '2026-10-21T11:00:00+0200',
    observations: Array.from({ length: count }, (_, index) => ({
      period: `2024-${String(index + 1).padStart(2, '0')}`,
      rate: 3 + index / 10,
    })),
  };
}

function configure(getSeries: ReturnType<typeof vi.fn>): void {
  TestBed.configureTestingModule({
    imports: [SeriesDetail],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ id: 'series-1' }) } },
      },
      { provide: ZetarisService, useValue: { getSeries } },
      {
        provide: SeriesStoreService,
        useValue: {
          series: signal([record()]),
          loadWarning: signal(null),
          delete: vi.fn(() => true),
        },
      },
    ],
  });
}

describe('SeriesDetail', () => {
  it('renders the latest 24 observations and can show all', async () => {
    const getSeries = vi.fn(() => Promise.resolve(seriesData()));
    configure(getSeries);

    const fixture = TestBed.createComponent(SeriesDetail);
    fixture.detectChanges();
    await fixture.componentInstance.load();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Poland total');
    expect(compiled.querySelector('app-rate-chart svg')).toBeTruthy();
    expect(compiled.querySelectorAll('tbody tr')).toHaveLength(24);
    expect(compiled.querySelector('tbody tr td')?.textContent).toContain('2024-30');

    const showAll = Array.from(compiled.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Show all observations'),
    );
    showAll?.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr')).toHaveLength(30);
  });

  it('shows an error and a retry action when the fetch fails', async () => {
    const getSeries = vi.fn(() => Promise.reject(new Error('Network down')));
    configure(getSeries);

    const fixture = TestBed.createComponent(SeriesDetail);
    fixture.detectChanges();
    await fixture.componentInstance.load();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert.error')?.textContent).toContain('Network down');
    expect(compiled.querySelector('.alert.error button')?.textContent).toContain('Retry');
  });
});
