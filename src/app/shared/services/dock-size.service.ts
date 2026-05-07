import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';

export interface DockSizeOption {
  label: string;
  value: number;
}

export const DOCK_SIZES: DockSizeOption[] = [
  { label: 'S', value: 44 },
  { label: 'M', value: 56 },
  { label: 'L', value: 72 },
];

@Injectable({ providedIn: 'root' })
export class DockSizeService {
  private readonly storage = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);

  size = signal<number>(this.storage.get<number>('dockSize') ?? 56);

  constructor() {
    this._apply(this.size());
  }

  setSize(px: number): void {
    this.size.set(px);
    this._apply(px);
    this.storage.set('dockSize', px);
  }

  private _apply(px: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.documentElement.style.setProperty('--dock-icon-size', `${px}px`);
  }
}
