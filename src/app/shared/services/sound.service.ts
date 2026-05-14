import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly storage = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);

  soundEnabled = signal<boolean>(this.storage.get<boolean>('sound') ?? true);
  /** Volume level 0–100. */
  volume = signal<number>(this.storage.get<number>('volume') ?? 80);

  /** Gain factor (0–1) derived from volume and mute state. */
  readonly gainFactor = computed(() => this.soundEnabled() ? this.volume() / 100 : 0);

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled.set(enabled);
    this.storage.set('sound', enabled);
  }

  setVolume(v: number): void {
    const clamped = Math.max(0, Math.min(100, Math.round(v)));
    this.volume.set(clamped);
    this.storage.set('volume', clamped);
    if (clamped > 0 && !this.soundEnabled()) {
      this.setSoundEnabled(true);
    }
  }

  /** Play a short notification tone via Web Audio API. */
  playNotification(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    const gain = this.gainFactor();
    if (gain === 0) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.12 * gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch { /* AudioContext may not be available */ }
  }

  /** Play a short error tone. */
  playError(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    const gain = this.gainFactor();
    if (gain === 0) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      g.gain.setValueAtTime(0.08 * gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* ignore */ }
  }

  /**
   * Play the macOS-style startup chord — ascending C major arpeggio.
   * Should be called after a user gesture to satisfy browser autoplay policy.
   */
  playBoot(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    const gain = this.gainFactor();
    if (gain === 0) return;
    try {
      const ctx = new AudioContext();
      const notes: Array<{ freq: number; delay: number; duration: number }> = [
        { freq: 261.63, delay: 0,    duration: 1.4 }, // C4
        { freq: 329.63, delay: 0.06, duration: 1.3 }, // E4
        { freq: 392.00, delay: 0.12, duration: 1.2 }, // G4
        { freq: 523.25, delay: 0.18, duration: 1.1 }, // C5
      ];
      notes.forEach(({ freq, delay, duration }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(0.07 * gain, ctx.currentTime + delay + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      });
    } catch { /* ignore */ }
  }

  /**
   * Play a descending shutdown chord — mirrors playBoot() in reverse.
   * Indicates the system is shutting down or rebooting.
   */
  playShutdown(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    const gain = this.gainFactor();
    if (gain === 0) return;
    try {
      const ctx = new AudioContext();
      const notes: Array<{ freq: number; delay: number }> = [
        { freq: 523.25, delay: 0    }, // C5
        { freq: 392.00, delay: 0.1  }, // G4
        { freq: 261.63, delay: 0.2  }, // C4
      ];
      notes.forEach(({ freq, delay }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.08 * gain, ctx.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.4);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.4);
      });
    } catch { /* ignore */ }
  }

  /** Play a soft ascending chirp when a dialog window opens. */
  playAppOpen(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    const gain = this.gainFactor();
    if (gain === 0) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.055 * gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } catch { /* ignore */ }
  }

  /** Play a soft descending swish when a dialog window closes. */
  playAppClose(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    const gain = this.gainFactor();
    if (gain === 0) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(760, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.045 * gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } catch { /* ignore */ }
  }

  /** Play a short tap when a desktop document icon is single-clicked. */
  playDocumentClick(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    const gain = this.gainFactor();
    if (gain === 0) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      g.gain.setValueAtTime(0.05 * gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } catch { /* ignore */ }
  }

  /** Play a subtle pop when a context menu or popover opens. */
  playContextMenu(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    const gain = this.gainFactor();
    if (gain === 0) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.04);
      g.gain.setValueAtTime(0.04 * gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } catch { /* ignore */ }
  }
}
