export const GEO_CODES = ['PL'] as const;
export type GeoCode = (typeof GEO_CODES)[number];

export const SEX_CODES = ['T'] as const;
export type SexCode = (typeof SEX_CODES)[number];

export interface SeriesFilters {
  geo: GeoCode;
  sex: SexCode;
}

export interface SavedSeries {
  id: string;
  name: string;
  note: string;
  filters: SeriesFilters;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSeriesInput {
  name: string;
  note: string;
  filters: SeriesFilters;
}

export interface Observation {
  period: string;
  rate: number;
}

export interface SeriesData {
  datasetLabel: string;
  source: string;
  updated: string;
  observations: Observation[];
}
