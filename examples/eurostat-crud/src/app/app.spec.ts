import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('creates the app shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the brand and primary navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.brand-copy strong')?.textContent).toContain('Eurostat CRUD');
    expect(compiled.querySelectorAll('.app-nav a')).toHaveLength(3);
    expect(compiled.querySelector('.connection-banner')?.textContent).toContain('not configured');
    expect(compiled.querySelector('.app-footer')?.textContent).toContain('Zetaris');
  });
});
