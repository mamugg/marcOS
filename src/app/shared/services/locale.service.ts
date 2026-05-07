import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

export type Locale = 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly storage = inject(StorageService);
  private readonly translate = inject(TranslateService);

  locale = signal<Locale>(this.storage.get<Locale>('locale') ?? 'fr');

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    this.storage.set('locale', locale);
    this.translate.use(locale);
  }
}
