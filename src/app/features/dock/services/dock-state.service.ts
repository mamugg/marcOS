import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DockStateService {
  displayFinder = signal(false);
  displayTerminal = signal(false);
  displayGalleria = signal(false);

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

