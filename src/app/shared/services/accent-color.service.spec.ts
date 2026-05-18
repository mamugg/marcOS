import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { AccentColorService, ACCENT_COLORS } from './accent-color.service';
import { StorageService } from './storage.service';

describe('AccentColorService', () => {
  let service: AccentColorService;

  const setup = (platformId = 'browser') => {
    TestBed.configureTestingModule({
      providers: [
        AccentColorService,
        StorageService,
        { provide: PLATFORM_ID, useValue: platformId }
      ]
    });
    service = TestBed.inject(AccentColorService);
  };

  beforeEach(() => {
    setup();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default accent to blue', () => {
    expect(service.accent()).toBe(ACCENT_COLORS[0].value);
  });

  it('setAccent() updates the accent signal', () => {
    service.setAccent(ACCENT_COLORS[1].value);
    expect(service.accent()).toBe(ACCENT_COLORS[1].value);
  });

  it('setAccent() persists to storage', () => {
    const storage = TestBed.inject(StorageService);
    service.setAccent(ACCENT_COLORS[2].value);
    expect(storage.get<string>('accent')).toBe(ACCENT_COLORS[2].value);
  });

  it('setAccent() applies --p-primary-500 CSS variable for blue', () => {
    service.setAccent(ACCENT_COLORS[0].value);
    const val = document.documentElement.style.getPropertyValue('--p-primary-500');
    expect(val).toBe(ACCENT_COLORS[0].value);
  });

  it('setAccent() does not throw for an unknown accent color', () => {
    expect(() => service.setAccent('#unknown-color')).not.toThrow();
  });

  it('ACCENT_COLORS exports 7 color options', () => {
    expect(ACCENT_COLORS).toHaveLength(7);
  });

  it('ACCENT_COLORS includes blue and violet', () => {
    const ids = ACCENT_COLORS.map(c => c.id);
    expect(ids).toContain('blue');
    expect(ids).toContain('violet');
  });

  it('should not throw when not in browser platform', () => {
    TestBed.resetTestingModule();
    setup('server');
    expect(() => service.setAccent(ACCENT_COLORS[0].value)).not.toThrow();
  });

  it('should restore accent from storage on init', () => {
    const storage = TestBed.inject(StorageService);
    storage.set('accent', ACCENT_COLORS[3].value);

    TestBed.resetTestingModule();
    setup();

    expect(service.accent()).toBe(ACCENT_COLORS[3].value);
  });
});
