import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockComponent } from '../dock/dock.component';
import { FinderDialogComponent } from '../finder-dialog/finder-dialog.component';
import { TerminalDialogComponent } from '../terminal-dialog/terminal-dialog.component';
import { GalleriaDialogComponent } from '../galleria-dialog/galleria-dialog.component';
import { ToastNotifierComponent } from '../toast-notifier/toast-notifier.component';
import { ProjectsDialogComponent } from '@app/features/projects/projects-dialog.component';
import { MailDialogComponent } from '@app/features/mail/mail-dialog.component';
import { AboutDialogComponent } from '@app/features/about/about-dialog.component';

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
    AboutDialogComponent
  ],
  templateUrl: './dock-window.component.html',
  styleUrl: './dock-window.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DockWindowComponent {}

