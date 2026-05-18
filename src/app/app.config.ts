import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

function initTranslate(translate: TranslateService): () => Promise<unknown> {
  return () => {
    translate.setDefaultLang('fr');
    const raw = localStorage.getItem('marcOS_locale');
    const saved = raw ? (JSON.parse(raw) as 'fr' | 'en') : null;
    return translate.use(saved ?? 'fr').toPromise().catch(() => {
      console.error('[i18n] Failed to load translations, falling back to default lang');
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.p-dark' }
      }
    }),
    provideTranslateService(),
    ...provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslate,
      deps: [TranslateService],
      multi: true
    }
  ]
};
