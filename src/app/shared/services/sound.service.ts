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
}
