import type { GeoCode, SexCode } from './saved-series.model';

export const GEO_LABELS: Record<GeoCode, string> = {
  PL: 'Poland',
};

export const SEX_LABELS: Record<SexCode, string> = {
  T: 'Total',
};

export function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
