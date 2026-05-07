import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _document = inject(DOCUMENT);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _storage = inject(StorageService);

  /** Persisted under marcOS_theme, same pattern as wallpaper. */
  isDark = signal<boolean>(this._readDarkMode());

  constructor() {
    this._applyClass(this.isDark());
  }

  toggleTheme(): void {
    this.setTheme(!this.isDark());
  }

  setTheme(dark: boolean): void {
    this.isDark.set(dark);
    this._applyClass(dark);
    this._persist(dark);
  }

  private _readDarkMode(): boolean {
    if (!isPlatformBrowser(this._platformId)) return false;

    // Primary source: own StorageService key
    const own = this._storage.get<boolean>('theme');
    if (own !== null) return own;

    // Migration fallback: read from ThemeSwitcher's legacy key
    try {
      const switcher = localStorage.getItem('themeSwitcherState');
      if (switcher) return (JSON.parse(switcher) as { darkTheme?: boolean }).darkTheme ?? false;
    } catch { /* ignore */ }

    return false;
  }

  private _applyClass(dark: boolean): void {
    if (dark) {
      this._document.documentElement.classList.add('p-dark');
    } else {
      this._document.documentElement.classList.remove('p-dark');
    }
  }

  private _persist(dark: boolean): void {
    // Own storage (primary)
    this._storage.set('theme', dark);

    // Keep ThemeSwitcher's key in sync so it restores correctly on reload
    if (!isPlatformBrowser(this._platformId)) return;
    try {
      const raw = localStorage.getItem('themeSwitcherState');
      const state: Record<string, unknown> = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      localStorage.setItem('themeSwitcherState', JSON.stringify({ ...state, darkTheme: dark }));
    } catch { /* ignore */ }
  }
}
