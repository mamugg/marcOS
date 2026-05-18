import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { SoundService } from './sound.service';
import { StorageService } from './storage.service';

/** Minimal AudioContext mock so withAudio() callbacks can execute in jsdom. */
function makeAudioContextMock() {
  const osc = {
    connect: vi.fn(),
    type: '' as OscillatorType,
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      value: 0,
    },
    start: vi.fn(),
    stop: vi.fn(),
  };
  const gainNode = {
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
  };
  return {
    ctx: { createOscillator: vi.fn(() => osc), createGain: vi.fn(() => gainNode), destination: {}, currentTime: 0 },
    osc,
    gainNode,
  };
}

describe('SoundService', () => {
  let service: SoundService;
  let audioMock: ReturnType<typeof makeAudioContextMock>;

  beforeEach(() => {
    localStorage.clear();
    audioMock = makeAudioContextMock();
    vi.stubGlobal('AudioContext', vi.fn(() => audioMock.ctx));

    TestBed.configureTestingModule({
      providers: [
        SoundService,
        StorageService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(SoundService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
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
    expect(() => {
      service.playBoot();
      service.playShutdown();
      service.playAppOpen();
      service.playAppClose();
      service.playDocumentClick();
      service.playContextMenu();
    }).not.toThrow();
  });

  // ── Audio callbacks coverage — spy on private withAudio to inject mock ctx ──

  describe('audio callbacks (via withAudio spy)', () => {
    let withAudioSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      // Spy on private withAudio so the callback is always invoked with our mock ctx
      withAudioSpy = vi.spyOn(
        service as unknown as { withAudio(fn: (ctx: AudioContext) => void): void },
        'withAudio'
      ).mockImplementation((fn: (ctx: AudioContext) => void) => {
        fn(audioMock.ctx as unknown as AudioContext);
      });
    });

    it('playBoot() invokes audio callbacks with oscillators', () => {
      service.setSoundEnabled(true);
      service.playBoot();
      expect(audioMock.ctx.createOscillator).toHaveBeenCalled();
      expect(audioMock.osc.start).toHaveBeenCalled();
    });

    it('playShutdown() invokes audio callbacks with oscillators', () => {
      service.setSoundEnabled(true);
      service.playShutdown();
      expect(audioMock.ctx.createOscillator).toHaveBeenCalled();
      expect(audioMock.osc.start).toHaveBeenCalled();
    });

    it('playAppOpen() invokes audio callback with oscillator', () => {
      service.setSoundEnabled(true);
      service.playAppOpen();
      expect(audioMock.ctx.createOscillator).toHaveBeenCalled();
      expect(audioMock.osc.start).toHaveBeenCalled();
    });

    it('playAppClose() invokes audio callback with oscillator', () => {
      service.setSoundEnabled(true);
      service.playAppClose();
      expect(audioMock.ctx.createOscillator).toHaveBeenCalled();
      expect(audioMock.osc.start).toHaveBeenCalled();
    });

    it('playDocumentClick() invokes audio callback with oscillator', () => {
      service.setSoundEnabled(true);
      service.playDocumentClick();
      expect(audioMock.ctx.createOscillator).toHaveBeenCalled();
      expect(audioMock.osc.start).toHaveBeenCalled();
    });

    it('playContextMenu() invokes audio callback with oscillator', () => {
      service.setSoundEnabled(true);
      service.playContextMenu();
      expect(audioMock.ctx.createOscillator).toHaveBeenCalled();
      expect(audioMock.osc.start).toHaveBeenCalled();
    });

    it('playNotification() invokes audio callback with oscillator', () => {
      service.setSoundEnabled(true);
      service.playNotification();
      expect(audioMock.ctx.createOscillator).toHaveBeenCalled();
      expect(audioMock.osc.start).toHaveBeenCalled();
    });

    it('playError() invokes audio callback with oscillator', () => {
      service.setSoundEnabled(true);
      service.playError();
      expect(audioMock.ctx.createOscillator).toHaveBeenCalled();
      expect(audioMock.osc.start).toHaveBeenCalled();
    });
  });
});
