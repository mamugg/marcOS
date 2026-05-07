import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly storage = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);

  soundEnabled = signal<boolean>(this.storage.get<boolean>('sound') ?? true);

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled.set(enabled);
    this.storage.set('sound', enabled);
  }

  /** Play a short notification tone via Web Audio API. */
  playNotification(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch { /* AudioContext may not be available */ }
  }

  /** Play a short error tone. */
  playError(): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* ignore */ }
  }
}
