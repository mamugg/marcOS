import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { SoundService } from './sound.service';
import { StorageService } from './storage.service';

describe('SoundService', () => {
  let service: SoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SoundService,
        StorageService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default soundEnabled to true', () => {
    expect(service.soundEnabled()).toBe(true);
  });

  it('should default volume to 80', () => {
    expect(service.volume()).toBe(80);
  });

  it('should compute gainFactor as volume/100 when enabled', () => {
    service.setSoundEnabled(true);
    service.setVolume(60);
    expect(service.gainFactor()).toBeCloseTo(0.6);
  });

  it('should compute gainFactor as 0 when disabled', () => {
    service.setSoundEnabled(false);
    expect(service.gainFactor()).toBe(0);
  });

  it('should clamp volume to 0–100', () => {
    service.setVolume(150);
    expect(service.volume()).toBe(100);
    service.setVolume(-10);
    expect(service.volume()).toBe(0);
  });

  it('should re-enable sound when volume is set above 0 while muted', () => {
    service.setSoundEnabled(false);
    service.setVolume(50);
    expect(service.soundEnabled()).toBe(true);
  });

  it('should not throw when playBoot is called', () => {
    expect(() => service.playBoot()).not.toThrow();
  });

  it('should not throw when playShutdown is called', () => {
    expect(() => service.playShutdown()).not.toThrow();
  });

  it('should not throw when playAppOpen is called', () => {
    expect(() => service.playAppOpen()).not.toThrow();
  });

  it('should not throw when playAppClose is called', () => {
    expect(() => service.playAppClose()).not.toThrow();
  });

  it('should not throw when playDocumentClick is called', () => {
    expect(() => service.playDocumentClick()).not.toThrow();
  });

  it('should not throw when playContextMenu is called', () => {
    expect(() => service.playContextMenu()).not.toThrow();
  });

  it('should not throw when playNotification is called', () => {
    expect(() => service.playNotification()).not.toThrow();
  });

  it('should not throw when playError is called', () => {
    expect(() => service.playError()).not.toThrow();
  });

  it('should not play sounds when disabled', () => {
    service.setSoundEnabled(false);
    // All play methods should return early — no errors expected
    expect(() => {
      service.playBoot();
      service.playShutdown();
      service.playAppOpen();
      service.playAppClose();
      service.playDocumentClick();
      service.playContextMenu();
    }).not.toThrow();
  });
});
