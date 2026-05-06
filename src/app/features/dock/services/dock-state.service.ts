import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from '@app/shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class DockStateService {
  private storageService = inject(StorageService);

  displayFinder = signal(false);
  displayTerminal = signal(false);
  displayGalleria = signal(false);
  displayProjects = signal(false);
  displayMail = signal(false);
  displayAbout = signal(false);
  displayCommandPalette = signal(false);

  wallpaper = signal(this.storageService.get<string>('wallpaper') ?? '/wallpaper.png');

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
  toggleCommandPalette(): void { this.displayCommandPalette.update(v => !v); }

  setFinder(value: boolean): void { this.displayFinder.set(value); }
  setTerminal(value: boolean): void { this.displayTerminal.set(value); }
  setGalleria(value: boolean): void { this.displayGalleria.set(value); }
  setProjects(value: boolean): void { this.displayProjects.set(value); }
  setMail(value: boolean): void { this.displayMail.set(value); }
  setAbout(value: boolean): void { this.displayAbout.set(value); }
  setCommandPalette(value: boolean): void { this.displayCommandPalette.set(value); }

  /** Close all open application windows. */
  closeAll(): void {
    this.setFinder(false);
    this.setTerminal(false);
    this.setGalleria(false);
    this.setProjects(false);
    this.setMail(false);
  }

  setWallpaper(url: string): void {
    this.wallpaper.set(url);
    this.storageService.set('wallpaper', url);
  }
}

