import { Injectable, inject, Injector, effect } from '@angular/core';
import type { Signal } from '@angular/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { SoundService } from './sound.service';

/**
 * Watches all dialog visibility signals and plays system sounds on open/close transitions.
 * Must be bootstrapped by injecting it in a component that is always alive (MainScreenComponent).
 */
@Injectable({ providedIn: 'root' })
export class SoundEffectsService {
  private readonly dockState = inject(DockStateService);
  private readonly sound = inject(SoundService);
  private readonly injector = inject(Injector);

  constructor() {
    const appSignals: Array<Signal<boolean>> = [
      this.dockState.displayFinder,
      this.dockState.displayTerminal,
      this.dockState.displayGalleria,
      this.dockState.displayProjects,
      this.dockState.displayMail,
      this.dockState.displayMusic,
      this.dockState.displayAbout,
      this.dockState.displaySettings,
      this.dockState.displayResume,
      this.dockState.displaySkills,
    ];

    appSignals.forEach(sig => this.watchAppSignal(sig));
    this.watchRebooting();
  }

  /**
   * Watch a boolean signal and play open/close sounds on transitions.
   * Uses a mutable prev ref so reads of prev inside the effect don't create
   * spurious reactive dependencies.
   */
  private watchAppSignal(sig: Signal<boolean>): void {
    const prev = { val: sig() };
    effect(() => {
      const cur = sig();
      if (cur && !prev.val) this.sound.playAppOpen();
      else if (!cur && prev.val) this.sound.playAppClose();
      prev.val = cur;
    }, { injector: this.injector });
  }

  /** Play shutdown sound when a reboot is triggered. */
  private watchRebooting(): void {
    const prev = { val: false };
    effect(() => {
      const cur = this.dockState.rebooting();
      if (cur && !prev.val) this.sound.playShutdown();
      prev.val = cur;
    }, { injector: this.injector });
  }
}
