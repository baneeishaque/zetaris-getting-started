import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { Observation, SeriesData, SeriesFilters } from '../series/saved-series.model';
import {
  ZetarisConnectionService,
  type ZetarisConnection,
} from './zetaris-connection.service';
import type { ZetarisSqlRequest, ZetarisSqlResponse } from './zetaris.models';

export const ZETARIS_SQL_PATH = '/sql-editor/sqls/run';
export const ZETARIS_SERIES_VIEW = 'eurostat.une_rt_m_pl_series_table';
export const ZETARIS_METADATA_VIEW = 'eurostat.une_rt_m_pl_metadata_table';
export const ZETARIS_SERIES_SQL = `SELECT period, unemployment_rate_pct FROM ${ZETARIS_SERIES_VIEW} ORDER BY period ASC`;
export const ZETARIS_METADATA_SQL = `SELECT dataset_label, dataset_source, last_updated FROM ${ZETARIS_METADATA_VIEW}`;

const CACHE_TTL_MS = 300_000;
const DEFAULT_DATASET_LABEL = 'Unemployment by sex and age - monthly data';
const DEFAULT_SOURCE = 'ESTAT';

interface CacheEntry {
  data: SeriesData;
  fetchedAt: number;
}

export class ZetarisDataError extends Error {
  constructor(message: string, override readonly cause?: unknown) {
    super(message);
    this.name = 'ZetarisDataError';
  }
}

@Injectable({ providedIn: 'root' })
export class ZetarisService {
  private readonly http = inject(HttpClient);
  private readonly connectionService = inject(ZetarisConnectionService);
  private readonly cache = new Map<string, CacheEntry>();

  async getSeries(filters: SeriesFilters): Promise<SeriesData> {
    if (filters.geo !== 'PL' || filters.sex !== 'T') {
      throw new ZetarisDataError('Zetaris currently exposes only the Poland total series.');
    }

    const cacheKey = `${filters.geo}:${filters.sex}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return cached.data;
    }

    const connection = this.requireConnection();
    const [seriesRows, metadataRows] = await Promise.all([
      this.runSql(connection, ZETARIS_SERIES_SQL, 1000),
      this.runSql(connection, ZETARIS_METADATA_SQL, 1),
    ]);

    const data = this.parse(filters, seriesRows, metadataRows);
    this.cache.set(cacheKey, { data, fetchedAt: Date.now() });
    return data;
  }

  async testConnection(connection: ZetarisConnection): Promise<void> {
    await this.runSql(connection, 'SELECT 1 AS ok', 1);
  }

  clearCache(): void {
    this.cache.clear();
  }

  private requireConnection(): ZetarisConnection {
    const connection = this.connectionService.connection();
    if (!connection) {
      throw new ZetarisDataError(
        'Zetaris is not configured. Open Connection and add an API key for this tab.',
      );
    }

    return connection;
  }

  private async runSql(
    connection: ZetarisConnection,
    sql: string,
    limit: number,
  ): Promise<unknown[][]> {
    const body: ZetarisSqlRequest = {
      queryId: createRequestId(),
      sql,
      source: 'SqlEditor',
      limit,
    };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${connection.apiKey}`,
      'X-Org-ID': connection.orgId,
      'X-Request-ID': createRequestId(),
      'Content-Type': 'application/json',
    });

    let response: ZetarisSqlResponse;
    try {
      response = await firstValueFrom(
        this.http.post<ZetarisSqlResponse>(
          `${connection.basePath}${ZETARIS_SQL_PATH}`,
          body,
          { headers },
        ),
      );
    } catch (error) {
      throw new ZetarisDataError(this.httpErrorMessage(error), error);
    }

    if (response?.error) {
      throw new ZetarisDataError(this.errorDetail(response.error) || 'Zetaris rejected the query.');
    }

    if (!response || !Array.isArray(response.data)) {
      throw new ZetarisDataError('Zetaris returned an unexpected SQL response.');
    }

    return response.data.filter((row): row is unknown[] => Array.isArray(row));
  }

  private parse(
    filters: SeriesFilters,
    seriesRows: unknown[][],
    metadataRows: unknown[][],
  ): SeriesData {
    const observations = new Map<string, number>();

    for (const row of seriesRows) {
      const period = asString(row[0]);
      const rate = asNumber(row[1]);

      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period) || rate === null) {
        continue;
      }

      observations.set(period, rate);
    }

    if (observations.size === 0) {
      throw new ZetarisDataError(
        `Zetaris returned no observations for ${filters.geo}/${filters.sex}.`,
      );
    }

    const metadata = metadataRows[0] ?? [];
    const datasetLabel = asString(metadata[0]) || DEFAULT_DATASET_LABEL;
    const source = asString(metadata[1]) || DEFAULT_SOURCE;
    const updated = asString(metadata[2]);

    return {
      datasetLabel,
      source,
      updated,
      observations: [...observations.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([period, rate]) => ({ period, rate })),
    };
  }

  private httpErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return 'Zetaris rejected the API key (HTTP 401). Update the connection settings.';
      }
      if (error.status === 403) {
        return 'Zetaris denied access (HTTP 403). Check the API key and organisation ID.';
      }
      if (error.status === 0) {
        return 'Could not reach Zetaris. Start the app with the dev proxy and check ZETARIS_REST_URL.';
      }

      const detail = this.errorDetail(error.error);
      return `Zetaris request failed (HTTP ${error.status})${detail ? `: ${detail}` : '.'}`;
    }

    return 'Zetaris request failed.';
  }

  private errorDetail(value: unknown): string {
    if (typeof value === 'string') {
      return value.slice(0, 300);
    }

    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      for (const key of ['message', 'error', 'detail']) {
        const candidate = record[key];
        if (typeof candidate === 'string') {
          return candidate.slice(0, 300);
        }
      }
    }

    return '';
  }
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function createRequestId(): string {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
