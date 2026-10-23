import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { GeoCode, SexCode } from '../../core/series/saved-series.model';
import { SeriesStoreService } from '../../core/series/series-store.service';
import { GEO_LABELS, SEX_LABELS, formatTimestamp } from '../../core/series/series-labels';

@Component({
  selector: 'app-series-list',
  imports: [RouterLink],
  templateUrl: './series-list.html',
  styleUrl: './series-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesList {
  readonly store = inject(SeriesStoreService);
  readonly formatTimestamp = formatTimestamp;

  geoLabel(geo: GeoCode): string {
    return GEO_LABELS[geo];
  }

  sexLabel(sex: SexCode): string {
    return SEX_LABELS[sex];
  }
}
