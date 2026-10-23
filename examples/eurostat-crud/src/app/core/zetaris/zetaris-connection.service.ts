import { Injectable, computed, signal } from '@angular/core';

export const ZETARIS_CONNECTION_STORAGE_KEY = 'eurostat-crud.zetaris-connection.v1';

export interface ZetarisConnection {
  basePath: string;
  orgId: string;
  apiKey: string;
}

@Injectable({ providedIn: 'root' })
export class ZetarisConnectionService {
  private readonly state = signal<ZetarisConnection | null>(this.load());

  readonly connection = this.state.asReadonly();
  readonly configured = computed(() => Boolean(this.state()?.apiKey));

  save(input: ZetarisConnection): void {
    const connection = normalize(input);
    if (!connection) {
      throw new Error('Enter a REST base path, organisation ID, and API key.');
    }

    try {
      sessionStorage.setItem(ZETARIS_CONNECTION_STORAGE_KEY, JSON.stringify(connection));
    } catch {
      throw new Error('Could not store the Zetaris connection in this browser tab.');
    }

    this.state.set(connection);
  }

  clear(): void {
    try {
      sessionStorage.removeItem(ZETARIS_CONNECTION_STORAGE_KEY);
    } catch {}

    this.state.set(null);
  }

  private load(): ZetarisConnection | null {
    try {
      const raw = sessionStorage.getItem(ZETARIS_CONNECTION_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== 'object') {
        sessionStorage.removeItem(ZETARIS_CONNECTION_STORAGE_KEY);
        return null;
      }

      const record = parsed as Record<string, unknown>;
      const connection = normalize({
        basePath: typeof record['basePath'] === 'string' ? record['basePath'] : '',
        orgId: typeof record['orgId'] === 'string' ? record['orgId'] : '',
        apiKey: typeof record['apiKey'] === 'string' ? record['apiKey'] : '',
      });

      if (!connection) {
        sessionStorage.removeItem(ZETARIS_CONNECTION_STORAGE_KEY);
      }

      return connection;
    } catch {
      return null;
    }
  }
}

function normalize(input: ZetarisConnection): ZetarisConnection | null {
  const basePath = input.basePath.trim().replace(/\/+$/, '');
  const orgId = input.orgId.trim();
  const apiKey = input.apiKey.trim();

  if (!basePath || !orgId || !apiKey) {
    return null;
  }

  if (!basePath.startsWith('/') && !/^https?:\/\//.test(basePath)) {
    return null;
  }

  if (/\s/.test(orgId)) {
    return null;
  }

  return { basePath, orgId, apiKey };
}
