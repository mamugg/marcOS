import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from '@app/shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class DockStateService {
  private storageService = inject(StorageService);

  // Initialize all dialogs as CLOSED (false) - don't persist to avoid auto-opening on reload
  displayFinder = signal(false);
  displayTerminal = signal(false);
  displayGalleria = signal(false);

  constructor() {
    // Clear all dialog states from localStorage on initialization
    // This ensures dialogs are always closed on page reload
    this.storageService.remove('displayFinder');
    this.storageService.remove('displayTerminal');
    this.storageService.remove('displayGalleria');
  }

  toggleFinder() {
    this.displayFinder.update(v => !v);
  }

  toggleTerminal() {
    this.displayTerminal.update(v => !v);
  }

  toggleGalleria() {
    this.displayGalleria.update(v => !v);
  }

  setFinder(value: boolean) {
    this.displayFinder.set(value);
  }

  setTerminal(value: boolean) {
    this.displayTerminal.set(value);
  }

  setGalleria(value: boolean) {
    this.displayGalleria.set(value);
  }
}

