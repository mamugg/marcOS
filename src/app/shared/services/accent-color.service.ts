import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';

export interface AccentColor {
  id: string;
  label: string;
  value: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'blue',   label: 'Blue',   value: '#3b82f6' },
  { id: 'violet', label: 'Violet', value: '#8b5cf6' },
  { id: 'pink',   label: 'Pink',   value: '#ec4899' },
  { id: 'red',    label: 'Red',    value: '#ef4444' },
  { id: 'orange', label: 'Orange', value: '#f97316' },
  { id: 'green',  label: 'Green',  value: '#22c55e' },
  { id: 'teal',   label: 'Teal',   value: '#14b8a6' },
];

/** Full Tailwind palette per accent — overrides PrimeNG's --p-primary-* CSS vars at runtime. */
const PALETTES: Record<string, Record<string, string>> = {
  '#3b82f6': {
    '--p-primary-50': '#eff6ff', '--p-primary-100': '#dbeafe', '--p-primary-200': '#bfdbfe',
    '--p-primary-300': '#93c5fd', '--p-primary-400': '#60a5fa', '--p-primary-500': '#3b82f6',
    '--p-primary-600': '#2563eb', '--p-primary-700': '#1d4ed8', '--p-primary-800': '#1e40af',
    '--p-primary-900': '#1e3a8a', '--p-primary-950': '#172554',
  },
  '#8b5cf6': {
    '--p-primary-50': '#f5f3ff', '--p-primary-100': '#ede9fe', '--p-primary-200': '#ddd6fe',
    '--p-primary-300': '#c4b5fd', '--p-primary-400': '#a78bfa', '--p-primary-500': '#8b5cf6',
    '--p-primary-600': '#7c3aed', '--p-primary-700': '#6d28d9', '--p-primary-800': '#5b21b6',
    '--p-primary-900': '#4c1d95', '--p-primary-950': '#2e1065',
  },
  '#ec4899': {
    '--p-primary-50': '#fdf2f8', '--p-primary-100': '#fce7f3', '--p-primary-200': '#fbcfe8',
    '--p-primary-300': '#f9a8d4', '--p-primary-400': '#f472b6', '--p-primary-500': '#ec4899',
    '--p-primary-600': '#db2777', '--p-primary-700': '#be185d', '--p-primary-800': '#9d174d',
    '--p-primary-900': '#831843', '--p-primary-950': '#500724',
  },
  '#ef4444': {
    '--p-primary-50': '#fef2f2', '--p-primary-100': '#fee2e2', '--p-primary-200': '#fecaca',
    '--p-primary-300': '#fca5a5', '--p-primary-400': '#f87171', '--p-primary-500': '#ef4444',
    '--p-primary-600': '#dc2626', '--p-primary-700': '#b91c1c', '--p-primary-800': '#991b1b',
    '--p-primary-900': '#7f1d1d', '--p-primary-950': '#450a0a',
  },
  '#f97316': {
    '--p-primary-50': '#fff7ed', '--p-primary-100': '#ffedd5', '--p-primary-200': '#fed7aa',
    '--p-primary-300': '#fdba74', '--p-primary-400': '#fb923c', '--p-primary-500': '#f97316',
    '--p-primary-600': '#ea580c', '--p-primary-700': '#c2410c', '--p-primary-800': '#9a3412',
    '--p-primary-900': '#7c2d12', '--p-primary-950': '#431407',
  },
  '#22c55e': {
    '--p-primary-50': '#f0fdf4', '--p-primary-100': '#dcfce7', '--p-primary-200': '#bbf7d0',
    '--p-primary-300': '#86efac', '--p-primary-400': '#4ade80', '--p-primary-500': '#22c55e',
    '--p-primary-600': '#16a34a', '--p-primary-700': '#15803d', '--p-primary-800': '#166534',
    '--p-primary-900': '#14532d', '--p-primary-950': '#052e16',
  },
  '#14b8a6': {
    '--p-primary-50': '#f0fdfa', '--p-primary-100': '#ccfbf1', '--p-primary-200': '#99f6e4',
    '--p-primary-300': '#5eead4', '--p-primary-400': '#2dd4bf', '--p-primary-500': '#14b8a6',
    '--p-primary-600': '#0d9488', '--p-primary-700': '#0f766e', '--p-primary-800': '#115e59',
    '--p-primary-900': '#134e4a', '--p-primary-950': '#042f2e',
  },
};

@Injectable({ providedIn: 'root' })
export class AccentColorService {
  private readonly storage = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);

  accent = signal<string>(this.storage.get<string>('accent') ?? ACCENT_COLORS[0].value);

  constructor() {
    this._apply(this.accent());
  }

  setAccent(color: string): void {
    this.accent.set(color);
    this._apply(color);
    this.storage.set('accent', color);
  }

  private _apply(color: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const palette = PALETTES[color];
    if (!palette) return;
    const root = document.documentElement;
    Object.entries(palette).forEach(([prop, val]) => root.style.setProperty(prop, val));
  }
}
