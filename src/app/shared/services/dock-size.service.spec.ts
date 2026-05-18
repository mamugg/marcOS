import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DockSizeService, DOCK_SIZES } from './dock-size.service';
import { StorageService } from './storage.service';

describe('DockSizeService', () => {
  let service: DockSizeService;

  const setup = (platformId = 'browser') => {
    TestBed.configureTestingModule({
      providers: [
        DockSizeService,
        StorageService,
        { provide: PLATFORM_ID, useValue: platformId }
      ]
    });
    service = TestBed.inject(DockSizeService);
  };

  beforeEach(() => {
    setup();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default size to 56 (Medium)', () => {
    expect(service.size()).toBe(56);
  });

  it('setSize() updates the size signal', () => {
    service.setSize(44);
    expect(service.size()).toBe(44);
  });

  it('setSize() persists to storage', () => {
    const storage = TestBed.inject(StorageService);
    service.setSize(72);
    expect(storage.get<number>('dockSize')).toBe(72);
  });

  it('setSize() applies --dock-icon-size CSS variable', () => {
    service.setSize(44);
    const val = document.documentElement.style.getPropertyValue('--dock-icon-size');
    expect(val).toBe('44px');
  });

  it('DOCK_SIZES exports 3 options', () => {
    expect(DOCK_SIZES).toHaveLength(3);
  });

  it('DOCK_SIZES contains S, M and L options', () => {
    const values = DOCK_SIZES.map(s => s.value);
    expect(values).toContain(44);
    expect(values).toContain(56);
    expect(values).toContain(72);
  });

  it('should not throw in server platform', () => {
    TestBed.resetTestingModule();
    setup('server');
    expect(() => service.setSize(44)).not.toThrow();
  });

  it('should restore size from storage on init', () => {
    const storage = TestBed.inject(StorageService);
    storage.set('dockSize', 72);

    TestBed.resetTestingModule();
    setup();

    expect(service.size()).toBe(72);
  });
});
