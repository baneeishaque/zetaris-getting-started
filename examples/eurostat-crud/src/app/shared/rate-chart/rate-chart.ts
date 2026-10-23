import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Observation } from '../../core/series/saved-series.model';

interface ChartPoint extends Observation {
  x: number;
  y: number;
}

const WIDTH = 640;
const HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 34, left: 46 };

@Component({
  selector: 'app-rate-chart',
  templateUrl: './rate-chart.html',
  styleUrl: './rate-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateChart {
  readonly observations = input.required<Observation[]>();

  readonly plotLeft = PADDING.left;
  readonly plotRight = WIDTH - PADDING.right;
  readonly plotTop = PADDING.top;
  readonly plotBottom = HEIGHT - PADDING.bottom;
  readonly plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  readonly gridLines = [0, 0.25, 0.5, 0.75, 1];

  readonly hasData = computed(() => this.observations().length > 0);

  readonly domain = computed(() => {
    const values = this.observations();
    if (values.length === 0) {
      return { low: 0, high: 1 };
    }

    const rates = values.map((observation) => observation.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const span = max - min || 1;

    return { low: min - span * 0.08, high: max + span * 0.08 };
  });

  readonly points = computed<ChartPoint[]>(() => {
    const values = this.observations();
    if (values.length === 0) {
      return [];
    }

    const { low, high } = this.domain();
    const step = values.length > 1 ? (this.plotRight - this.plotLeft) / (values.length - 1) : 0;

    return values.map((observation, index) => ({
      ...observation,
      x: this.plotLeft + index * step,
      y: this.plotTop + (1 - (observation.rate - low) / (high - low)) * this.plotHeight,
    }));
  });

  readonly linePath = computed(() => {
    const points = this.points();
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(' ');
  });

  readonly areaPath = computed(() => {
    const points = this.points();
    if (points.length === 0) {
      return '';
    }

    const first = points[0];
    const last = points[points.length - 1];
    const line = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(' ');

    return `${line} L ${last.x.toFixed(2)} ${this.plotBottom} L ${first.x.toFixed(2)} ${this.plotBottom} Z`;
  });

  readonly minRate = computed(() => {
    const values = this.observations();
    return values.length === 0 ? 0 : Math.min(...values.map((observation) => observation.rate));
  });

  readonly maxRate = computed(() => {
    const values = this.observations();
    return values.length === 0 ? 0 : Math.max(...values.map((observation) => observation.rate));
  });

  readonly minY = computed(() => this.yFor(this.minRate()));
  readonly maxY = computed(() => this.yFor(this.maxRate()));

  readonly firstPeriod = computed(() => this.observations()[0]?.period ?? '');
  readonly lastPeriod = computed(() => this.observations().at(-1)?.period ?? '');

  readonly ariaLabel = computed(() => {
    const values = this.observations();
    if (values.length === 0) {
      return 'No observations to chart.';
    }

    return `Line chart of unemployment rate from ${this.firstPeriod()} to ${this.lastPeriod()}, ${values.length} observations, ranging from ${this.minRate().toFixed(1)}% to ${this.maxRate().toFixed(1)}%.`;
  });

  private yFor(rate: number): number {
    const { low, high } = this.domain();
    return this.plotTop + (1 - (rate - low) / (high - low)) * this.plotHeight;
  }
}
