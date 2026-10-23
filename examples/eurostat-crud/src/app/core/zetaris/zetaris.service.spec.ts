import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ZetarisConnectionService } from './zetaris-connection.service';
import type { ZetarisSqlRequest } from './zetaris.models';
import {
  ZETARIS_METADATA_SQL,
  ZETARIS_SERIES_SQL,
  ZETARIS_SQL_PATH,
  ZetarisDataError,
  ZetarisService,
} from './zetaris.service';

const BASE_PATH = '/zetaris-api';

let httpMock: HttpTestingController;

function configure(apiKey: string | null = 'test-key'): ZetarisService {
  const connection = signal(
    apiKey ? { basePath: BASE_PATH, orgId: '1', apiKey } : null,
  );

  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: ZetarisConnectionService,
        useValue: { connection: connection.asReadonly() },
      },
    ],
  });

  httpMock = TestBed.inject(HttpTestingController);
  return TestBed.inject(ZetarisService);
}

function requestSql(request: { request: { body: unknown } }): string {
  return (request.request.body as ZetarisSqlRequest).sql;
}

describe('ZetarisService', () => {
  afterEach(() => {
    httpMock.verify();
  });

  it('queries the series and metadata views and sorts observations', async () => {
    const service = configure();
    const promise = service.getSeries({ geo: 'PL', sex: 'T' });
    const requests = httpMock.match((request) => request.url === `${BASE_PATH}${ZETARIS_SQL_PATH}`);

    expect(requests).toHaveLength(2);

    const seriesRequest = requests.find((request) => requestSql(request) === ZETARIS_SERIES_SQL);
    const metadataRequest = requests.find(
      (request) => requestSql(request) === ZETARIS_METADATA_SQL,
    );

    expect(seriesRequest).toBeTruthy();
    expect(metadataRequest).toBeTruthy();
    expect(seriesRequest?.request.headers.get('Authorization')).toBe('Bearer test-key');
    expect(seriesRequest?.request.headers.get('X-Org-ID')).toBe('1');
    expect(seriesRequest?.request.headers.get('X-Request-ID')).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect((seriesRequest?.request.body as ZetarisSqlRequest).limit).toBe(1000);
    expect((metadataRequest?.request.body as ZetarisSqlRequest).limit).toBe(1);

    seriesRequest?.flush({
      data: [
        ['2024-03', '3.9'],
        ['2024-01', '4.2'],
        ['2024-02', 4.0],
      ],
    });
    metadataRequest?.flush({
      data: [['Unemployment by sex and age - monthly data', 'ESTAT', '2026-10-21T11:00:00+0200']],
    });

    const result = await promise;

    expect(result.datasetLabel).toBe('Unemployment by sex and age - monthly data');
    expect(result.source).toBe('ESTAT');
    expect(result.updated).toBe('2026-10-21T11:00:00+0200');
    expect(result.observations).toEqual([
      { period: '2024-01', rate: 4.2 },
      { period: '2024-02', rate: 4.0 },
      { period: '2024-03', rate: 3.9 },
    ]);
  });

  it('caches successful responses for five minutes', async () => {
    const service = configure();
    const first = service.getSeries({ geo: 'PL', sex: 'T' });
    const requests = httpMock.match((request) => request.url === `${BASE_PATH}${ZETARIS_SQL_PATH}`);

    requests.find((request) => requestSql(request) === ZETARIS_SERIES_SQL)?.flush({
      data: [['2024-01', '4.2']],
    });
    requests.find((request) => requestSql(request) === ZETARIS_METADATA_SQL)?.flush({
      data: [['Dataset', 'ESTAT', '2026-10-21T11:00:00+0200']],
    });

    await first;
    const second = await service.getSeries({ geo: 'PL', sex: 'T' });

    expect(second.observations).toEqual([{ period: '2024-01', rate: 4.2 }]);
    httpMock.expectNone((request) => request.url === `${BASE_PATH}${ZETARIS_SQL_PATH}`);
  });

  it('requires a connection before querying', async () => {
    const service = configure(null);

    await expect(service.getSeries({ geo: 'PL', sex: 'T' })).rejects.toBeInstanceOf(
      ZetarisDataError,
    );
    httpMock.expectNone((request) => request.url === `${BASE_PATH}${ZETARIS_SQL_PATH}`);
  });

  it('reports an invalid API key', async () => {
    const service = configure('bad-key');
    const promise = service.getSeries({ geo: 'PL', sex: 'T' });
    const requests = httpMock.match((request) => request.url === `${BASE_PATH}${ZETARIS_SQL_PATH}`);

    requests.find((request) => requestSql(request) === ZETARIS_SERIES_SQL)?.flush(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' },
    );
    requests.find((request) => requestSql(request) === ZETARIS_METADATA_SQL)?.flush({
      data: [['Dataset', 'ESTAT', '2026-10-21T11:00:00+0200']],
    });

    await expect(promise).rejects.toThrow('API key');
  });

  it('rejects a response with no valid observations', async () => {
    const service = configure();
    const promise = service.getSeries({ geo: 'PL', sex: 'T' });
    const requests = httpMock.match((request) => request.url === `${BASE_PATH}${ZETARIS_SQL_PATH}`);

    requests.find((request) => requestSql(request) === ZETARIS_SERIES_SQL)?.flush({
      data: [['not-a-period', '3.9'], ['2024-01', 'not-a-number']],
    });
    requests.find((request) => requestSql(request) === ZETARIS_METADATA_SQL)?.flush({
      data: [['Dataset', 'ESTAT', '2026-10-21T11:00:00+0200']],
    });

    await expect(promise).rejects.toThrow('no observations');
  });

  it('tests a connection with SELECT 1', async () => {
    const service = configure();
    const promise = service.testConnection({
      basePath: BASE_PATH,
      orgId: '1',
      apiKey: 'test-key',
    });
    const request = httpMock.expectOne(`${BASE_PATH}${ZETARIS_SQL_PATH}`);

    expect(requestSql(request)).toBe('SELECT 1 AS ok');
    request.flush({ data: [['1']] });

    await expect(promise).resolves.toBeUndefined();
  });
});
