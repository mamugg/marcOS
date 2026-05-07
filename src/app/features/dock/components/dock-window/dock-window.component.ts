import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@app/shared/services/notification.service';
import { DockComponent } from '../dock/dock.component';
import { FinderDialogComponent } from '../finder-dialog/finder-dialog.component';
import { TerminalDialogComponent } from '../terminal-dialog/terminal-dialog.component';
import { GalleriaDialogComponent } from '../galleria-dialog/galleria-dialog.component';
import { ToastNotifierComponent } from '../toast-notifier/toast-notifier.component';
import { ProjectsDialogComponent } from '@app/features/projects/projects-dialog.component';
import { MailDialogComponent } from '@app/features/mail/mail-dialog.component';
import { AboutDialogComponent } from '@app/features/about/about-dialog.component';
import { SettingsDialogComponent } from '@app/features/settings/settings-dialog.component';
import { RebootOverlayComponent } from '../reboot-overlay/reboot-overlay.component';

@Component({
  selector: 'app-dock-window',
  standalone: true,
  imports: [
    CommonModule,
    DockComponent,
    FinderDialogComponent,
    TerminalDialogComponent,
    GalleriaDialogComponent,
    ToastNotifierComponent,
    ProjectsDialogComponent,
    MailDialogComponent,
    AboutDialogComponent,
    SettingsDialogComponent,
    RebootOverlayComponent
  ],
  templateUrl: './dock-window.component.html',
  styleUrl: './dock-window.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DockWindowComponent implements OnInit {
  private readonly notifications = inject(NotificationService);

  ngOnInit(): void {
    this.notifications.init();
  }
}

