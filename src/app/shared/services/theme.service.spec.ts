import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';
import { StorageService } from './storage.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let doc: Document;

  const setup = (platformId = 'browser') => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        StorageService,
        { provide: PLATFORM_ID, useValue: platformId }
      ]
    });
    service = TestBed.inject(ThemeService);
    doc = TestBed.inject(DOCUMENT);
  };

  beforeEach(() => {
    localStorage.clear();
    setup();
  });

  afterEach(() => {
    doc.documentElement.classList.remove('p-dark');
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default isDark to false when nothing is stored', () => {
    expect(service.isDark()).toBe(false);
  });

  it('should not have p-dark class initially', () => {
    expect(doc.documentElement.classList.contains('p-dark')).toBe(false);
  });

  it('setTheme(true) adds p-dark class', () => {
    service.setTheme(true);
    expect(doc.documentElement.classList.contains('p-dark')).toBe(true);
  });

  it('setTheme(false) removes p-dark class', () => {
    service.setTheme(true);
    service.setTheme(false);
    expect(doc.documentElement.classList.contains('p-dark')).toBe(false);
  });

  it('setTheme persists to storage', () => {
    const storage = TestBed.inject(StorageService);
    service.setTheme(true);
    expect(storage.get<boolean>('theme')).toBe(true);
  });

  it('toggleTheme() toggles from false to true', () => {
    expect(service.isDark()).toBe(false);
    service.toggleTheme();
    expect(service.isDark()).toBe(true);
  });

  it('toggleTheme() toggles from true to false', () => {
    service.setTheme(true);
    service.toggleTheme();
    expect(service.isDark()).toBe(false);
  });

  it('reads dark mode from StorageService on init', () => {
    const storage = TestBed.inject(StorageService);
    storage.set('theme', true);

    TestBed.resetTestingModule();
    setup();

    expect(service.isDark()).toBe(true);
  });

  it('falls back to themeSwitcherState legacy key when own key absent', () => {
    localStorage.setItem('themeSwitcherState', JSON.stringify({ darkTheme: true }));

    TestBed.resetTestingModule();
    setup();

    expect(service.isDark()).toBe(true);
    localStorage.removeItem('themeSwitcherState');
  });

  it('returns false when not in browser context', () => {
    TestBed.resetTestingModule();
    setup('server');
    expect(service.isDark()).toBe(false);
  });

  it('handles malformed themeSwitcherState gracefully', () => {
    localStorage.setItem('themeSwitcherState', 'not-valid-json{{{');

    TestBed.resetTestingModule();
    setup();

    expect(service.isDark()).toBe(false);
    localStorage.removeItem('themeSwitcherState');
  });
});
