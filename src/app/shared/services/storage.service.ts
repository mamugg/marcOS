import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly PREFIX = 'marcOS_';

  set(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde ${key}:`, error);
    }
  }

  get<T>(key: string, defaultValue: T): T;
  get<T>(key: string): T | null;
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : (defaultValue ?? null);
    } catch (error) {
      console.error(`Erreur lors de la lecture ${key}:`, error);
      return defaultValue ?? null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  getAllKeys(): string[] {
    const keys = Object.keys(localStorage);
    return keys.filter(key => key.startsWith(this.PREFIX)).map(key => key.replace(this.PREFIX, ''));
  }
}


