export interface ZetarisSqlRequest {
  queryId: string;
  sql: string;
  source: 'SqlEditor';
  limit: number;
}

export interface ZetarisSqlResponse {
  headers?: unknown;
  data?: unknown;
  total?: unknown;
  timeUsed?: unknown;
  error?: unknown;
}
