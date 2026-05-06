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

  constructor() {
    this.storageService.remove('displayFinder');
    this.storageService.remove('displayTerminal');
    this.storageService.remove('displayGalleria');
    this.storageService.remove('displayProjects');
    this.storageService.remove('displayMail');
  }

  toggleFinder() { this.displayFinder.update(v => !v); }
  toggleTerminal() { this.displayTerminal.update(v => !v); }
  toggleGalleria() { this.displayGalleria.update(v => !v); }
  toggleProjects() { this.displayProjects.update(v => !v); }
  toggleMail() { this.displayMail.update(v => !v); }

  setFinder(value: boolean) { this.displayFinder.set(value); }
  setTerminal(value: boolean) { this.displayTerminal.set(value); }
  setGalleria(value: boolean) { this.displayGalleria.set(value); }
  setProjects(value: boolean) { this.displayProjects.set(value); }
  setMail(value: boolean) { this.displayMail.set(value); }
}

