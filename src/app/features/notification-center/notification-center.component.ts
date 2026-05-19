import { Component, ChangeDetectionStrategy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { NotificationEntry } from '@app/shared/models';

/** marcOS feature highlights — loosely based on the project git history. */
export const NOTIFICATION_FEED: NotificationEntry[] = [
  {
    icon: 'pi pi-trash',
    titleKey: 'notification_center.entry.trash.title',
    descriptionKey: 'notification_center.entry.trash.description',
    date: new Date('2026-05-15'),
    type: 'success',
  },
  {
    icon: 'pi pi-mobile',
    titleKey: 'notification_center.entry.responsive.title',
    descriptionKey: 'notification_center.entry.responsive.description',
    date: new Date('2026-05-08'),
    type: 'success',
  },
  {
    icon: 'pi pi-th-large',
    titleKey: 'notification_center.entry.dock.title',
    descriptionKey: 'notification_center.entry.dock.description',
    date: new Date('2026-04-18'),
    type: 'info',
  },
  {
    icon: 'pi pi-power-off',
    titleKey: 'notification_center.entry.splash.title',
    descriptionKey: 'notification_center.entry.splash.description',
    date: new Date('2026-03-10'),
    type: 'info',
  },
  {
    icon: 'pi pi-volume-up',
    titleKey: 'notification_center.entry.sounds.title',
    descriptionKey: 'notification_center.entry.sounds.description',
    date: new Date('2026-02-05'),
    type: 'success',
  },
  {
    icon: 'pi pi-cloud-upload',
    titleKey: 'notification_center.entry.deploy.title',
    descriptionKey: 'notification_center.entry.deploy.description',
    date: new Date('2026-01-12'),
    type: 'success',
  },
];

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slidePanel', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('280ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('220ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class NotificationCenterComponent {
  protected readonly dockState = inject(DockStateService);
  private readonly translate = inject(TranslateService);

  readonly feed = NOTIFICATION_FEED;

  /** Resolve a relative date label (today, yesterday, x days/months ago). */
  relativeDate(date: Date): string {
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return this.translate.instant('notification_center.date.today');
    if (diffDays === 1) return this.translate.instant('notification_center.date.yesterday');
    if (diffDays < 30) {
      return this.translate.instant('notification_center.date.days_ago', { count: diffDays });
    }
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return this.translate.instant('notification_center.date.months_ago', { count: diffMonths });
    }
    const diffYears = Math.floor(diffDays / 365);
    return this.translate.instant('notification_center.date.years_ago', { count: diffYears });
  }

  /** Close on ESC key. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.dockState.displayNotificationCenter()) {
      this.dockState.setNotificationCenter(false);
    }
  }

  /** Close when clicking the backdrop. */
  onBackdropClick(): void {
    this.dockState.setNotificationCenter(false);
  }
}
