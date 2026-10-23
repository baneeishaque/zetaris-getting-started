import { Routes } from '@angular/router';
import { SeriesDetail } from './features/series-detail/series-detail';
import { SeriesForm } from './features/series-form/series-form';
import { SeriesList } from './features/series-list/series-list';
import { ZetarisSettings } from './features/zetaris-settings/zetaris-settings';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'series' },
  { path: 'series', component: SeriesList },
  { path: 'series/new', component: SeriesForm },
  { path: 'series/:id/edit', component: SeriesForm },
  { path: 'series/:id', component: SeriesDetail },
  { path: 'settings', component: ZetarisSettings },
  { path: '**', redirectTo: 'series' },
];
