import { Injectable, inject, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

const DELAY_2MIN = 2 * 60 * 1000;
const DELAY_10MIN = 10 * 60 * 1000;

/**
 * Fires timed toast notifications to engage visitors after 2 and 10 minutes.
 * Call `init()` once from the root layout component.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  private timers: ReturnType<typeof setTimeout>[] = [];
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.timers.push(
      setTimeout(() => this.fireMessageNotification(), DELAY_2MIN),
      setTimeout(() => this.fireExplorerNotification(), DELAY_10MIN)
    );
  }

  private fireMessageNotification(): void {
    this.messageService.add({
      severity: 'info',
      summary: this.translate.instant('notification.message.summary'),
      detail: this.translate.instant('notification.message.detail'),
      key: 'tc',
      life: 8000
    });
  }

  private fireExplorerNotification(): void {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('notification.explorer.summary'),
      detail: this.translate.instant('notification.explorer.detail'),
      key: 'tc',
      life: 10000
    });
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
  }
}
