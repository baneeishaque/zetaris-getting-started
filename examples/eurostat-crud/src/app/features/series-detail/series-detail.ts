import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Observation, SavedSeries, SeriesData } from '../../core/series/saved-series.model';
import { ZetarisService } from '../../core/zetaris/zetaris.service';
import { SeriesStoreService } from '../../core/series/series-store.service';
import { GEO_LABELS, SEX_LABELS, formatTimestamp } from '../../core/series/series-labels';
import { RateChart } from '../../shared/rate-chart/rate-chart';

@Component({
  selector: 'app-series-detail',
  imports: [RouterLink, RateChart],
  templateUrl: './series-detail.html',
  styleUrl: './series-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly zetaris = inject(ZetarisService);
  readonly store = inject(SeriesStoreService);

  readonly series = signal<SavedSeries | null>(null);
  readonly data = signal<SeriesData | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showAll = signal(false);
  readonly confirmingDelete = signal(false);
  readonly deleteError = signal<string | null>(null);

  readonly visibleObservations = computed(() => {
    const seriesData = this.data();
    if (!seriesData) {
      return [];
    }

    return this.showAll() ? seriesData.observations : seriesData.observations.slice(-24);
  });

  readonly tableObservations = computed(() => [...this.visibleObservations()].reverse());

  readonly hasMore = computed(() => (this.data()?.observations.length ?? 0) > 24);

  readonly latestObservation = computed<Observation | null>(
    () => this.data()?.observations.at(-1) ?? null,
  );

  readonly formatTimestamp = formatTimestamp;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Saved series not found.');
      return;
    }

    const record = this.store.series().find((item) => item.id === id);
    if (!record) {
      this.error.set('Saved series not found.');
      return;
    }

    this.series.set(record);
    void this.load();
  }

  async load(): Promise<void> {
    const record = this.series();
    if (!record) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const seriesData = await this.zetaris.getSeries(record.filters);
      this.data.set(seriesData);
    } catch (error) {
      this.data.set(null);
      this.error.set(
        error instanceof Error ? error.message : 'Could not load this Zetaris series.',
      );
    } finally {
      this.loading.set(false);
    }
  }

  toggleShowAll(): void {
    this.showAll.update((value) => !value);
  }

  deleteSeries(): void {
    const record = this.series();
    if (!record) {
      return;
    }

    this.deleteError.set(null);

    try {
      if (this.store.delete(record.id)) {
        void this.router.navigate(['/series']);
      } else {
        this.deleteError.set('This saved series no longer exists.');
      }
    } catch (error) {
      this.deleteError.set(
        error instanceof Error ? error.message : 'Could not delete this saved series.',
      );
    }
  }

  geoLabel(record: SavedSeries): string {
    return GEO_LABELS[record.filters.geo];
  }

  sexLabel(record: SavedSeries): string {
    return SEX_LABELS[record.filters.sex];
  }

  formatRate(rate: number): string {
    return rate.toFixed(1);
  }
}
