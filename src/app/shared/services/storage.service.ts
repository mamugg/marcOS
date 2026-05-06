import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly PREFIX = 'marcOS_';

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde ${key}:`, error);
    }
  }

  get<T>(key: string, defaultValue: T): T;
  get<T>(key: string): T | null;
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? (JSON.parse(item) as T) : (defaultValue ?? null);
    } catch (error) {
      console.error(`Erreur lors de la lecture ${key}:`, error);
      return defaultValue ?? null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }

  getAllKeys(): string[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.PREFIX))
      .map(key => key.replace(this.PREFIX, ''));
  }
}
