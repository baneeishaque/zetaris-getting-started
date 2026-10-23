import { TestBed } from '@angular/core/testing';
import {
  ZETARIS_CONNECTION_STORAGE_KEY,
  ZetarisConnectionService,
} from './zetaris-connection.service';

function createService(): ZetarisConnectionService {
  TestBed.configureTestingModule({});
  return TestBed.inject(ZetarisConnectionService);
}

describe('ZetarisConnectionService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('saves a trimmed connection and reports it as configured', () => {
    const service = createService();

    service.save({
      basePath: ' /zetaris-api/ ',
      orgId: ' 1 ',
      apiKey: ' test-key ',
    });

    expect(service.configured()).toBe(true);
    expect(service.connection()).toEqual({
      basePath: '/zetaris-api',
      orgId: '1',
      apiKey: 'test-key',
    });

    const stored = JSON.parse(sessionStorage.getItem(ZETARIS_CONNECTION_STORAGE_KEY) ?? '{}');
    expect(stored.apiKey).toBe('test-key');
  });

  it('loads a saved connection for the current tab', () => {
    sessionStorage.setItem(
      ZETARIS_CONNECTION_STORAGE_KEY,
      JSON.stringify({ basePath: '/zetaris-api', orgId: '1', apiKey: 'test-key' }),
    );

    const service = createService();

    expect(service.configured()).toBe(true);
    expect(service.connection()?.apiKey).toBe('test-key');
  });

  it('clears the connection', () => {
    const service = createService();
    service.save({ basePath: '/zetaris-api', orgId: '1', apiKey: 'test-key' });

    service.clear();

    expect(service.configured()).toBe(false);
    expect(service.connection()).toBeNull();
    expect(sessionStorage.getItem(ZETARIS_CONNECTION_STORAGE_KEY)).toBeNull();
  });

  it('rejects incomplete input', () => {
    const service = createService();

    expect(() => service.save({ basePath: '', orgId: '1', apiKey: 'key' })).toThrow();
    expect(() => service.save({ basePath: '/zetaris-api', orgId: '', apiKey: 'key' })).toThrow();
    expect(() => service.save({ basePath: '/zetaris-api', orgId: '1', apiKey: '' })).toThrow();
    expect(service.configured()).toBe(false);
  });

  it('ignores corrupt stored JSON', () => {
    sessionStorage.setItem(ZETARIS_CONNECTION_STORAGE_KEY, '{');

    const service = createService();

    expect(service.configured()).toBe(false);
  });
});
