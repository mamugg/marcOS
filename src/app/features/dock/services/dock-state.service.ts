import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from '@app/shared/services/storage.service';

const DEFAULT_WALLPAPER = "url('/wallpaper.png') center/cover no-repeat";

@Injectable({ providedIn: 'root' })
export class DockStateService {
  private storageService = inject(StorageService);

  displayFinder = signal(false);
  displayTerminal = signal(false);
  displayGalleria = signal(false);
  displayProjects = signal(false);
  displayMail = signal(false);
  displayAbout = signal(false);
  displaySettings = signal(false);
  displayCommandPalette = signal(false);
  rebooting = signal(false);

  wallpaper = signal(this._resolveWallpaper());

  constructor() {
    this.storageService.remove('displayFinder');
    this.storageService.remove('displayTerminal');
    this.storageService.remove('displayGalleria');
    this.storageService.remove('displayProjects');
    this.storageService.remove('displayMail');
  }

  toggleFinder(): void { this.displayFinder.update(v => !v); }
  toggleTerminal(): void { this.displayTerminal.update(v => !v); }
  toggleGalleria(): void { this.displayGalleria.update(v => !v); }
  toggleProjects(): void { this.displayProjects.update(v => !v); }
  toggleMail(): void { this.displayMail.update(v => !v); }
  toggleAbout(): void { this.displayAbout.update(v => !v); }
  toggleSettings(): void { this.displaySettings.update(v => !v); }
  toggleCommandPalette(): void { this.displayCommandPalette.update(v => !v); }

  setFinder(value: boolean): void { this.displayFinder.set(value); }
  setTerminal(value: boolean): void { this.displayTerminal.set(value); }
  setGalleria(value: boolean): void { this.displayGalleria.set(value); }
  setProjects(value: boolean): void { this.displayProjects.set(value); }
  setMail(value: boolean): void { this.displayMail.set(value); }
  setAbout(value: boolean): void { this.displayAbout.set(value); }
  setSettings(value: boolean): void { this.displaySettings.set(value); }
  setCommandPalette(value: boolean): void { this.displayCommandPalette.set(value); }

  /** Close all open application windows. */
  closeAll(): void {
    this.setFinder(false);
    this.setTerminal(false);
    this.setGalleria(false);
    this.setProjects(false);
    this.setMail(false);
    this.setSettings(false);
  }

  /** Clear all persisted settings and trigger the reboot animation. */
  reboot(): void {
    this.storageService.clear();
    // Clear the legacy ThemeSwitcher key (no marcOS_ prefix) so the
    // dark theme doesn't survive the factory reset via the migration fallback.
    try { localStorage.removeItem('themeSwitcherState'); } catch { /* ignore */ }
    this.closeAll();
    this.rebooting.set(true);
  }

  setWallpaper(value: string): void {
    this.wallpaper.set(value);
    this.storageService.set('wallpaper', value);
  }

  /** Migrate old URL-only format to full CSS background value. */
  private _resolveWallpaper(): string {
    const stored = this.storageService.get<string>('wallpaper');
    if (!stored) return DEFAULT_WALLPAPER;
    const isRaw = !stored.startsWith('url(') && !stored.includes('gradient');
    return isRaw ? DEFAULT_WALLPAPER : stored;
  }
}

