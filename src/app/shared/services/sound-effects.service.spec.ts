import { TestBed } from '@angular/core/testing';
import { SoundEffectsService } from './sound-effects.service';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { SoundService } from './sound.service';
import { StorageService } from './storage.service';

describe('SoundEffectsService', () => {
  let service: SoundEffectsService;
  let dockState: DockStateService;
  let sound: SoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoundEffectsService, DockStateService, SoundService, StorageService]
    });
    service = TestBed.inject(SoundEffectsService);
    dockState = TestBed.inject(DockStateService);
    sound = TestBed.inject(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should play app open sound when a dialog becomes visible', () => {
    const spy = vi.spyOn(sound, 'playAppOpen');
    TestBed.flushEffects();

    dockState.setFinder(true);
    TestBed.flushEffects();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should play app close sound when a dialog becomes hidden', () => {
    const openSpy = vi.spyOn(sound, 'playAppOpen');
    const closeSpy = vi.spyOn(sound, 'playAppClose');

    dockState.setFinder(true);
    TestBed.flushEffects();
    openSpy.mockClear();

    dockState.setFinder(false);
    TestBed.flushEffects();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should play shutdown sound when rebooting becomes true', () => {
    const spy = vi.spyOn(sound, 'playShutdown');
    TestBed.flushEffects();

    dockState.reboot();
    TestBed.flushEffects();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not play sounds on initial load when all dialogs are closed', () => {
    const openSpy = vi.spyOn(sound, 'playAppOpen');
    const closeSpy = vi.spyOn(sound, 'playAppClose');
    TestBed.flushEffects();

    expect(openSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should play open sound for multiple independent dialogs', () => {
    const spy = vi.spyOn(sound, 'playAppOpen');
    TestBed.flushEffects();

    dockState.setFinder(true);
    TestBed.flushEffects();
    dockState.setTerminal(true);
    TestBed.flushEffects();

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
