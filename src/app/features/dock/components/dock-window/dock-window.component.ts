import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockComponent } from '../dock/dock.component';
import { FinderDialogComponent } from '../finder-dialog/finder-dialog.component';
import { TerminalDialogComponent } from '../terminal-dialog/terminal-dialog.component';
import { GalleriaDialogComponent } from '../galleria-dialog/galleria-dialog.component';
import { ToastNotifierComponent } from '../toast-notifier/toast-notifier.component';
import { ProjectsDialogComponent } from '@app/features/projects/projects-dialog.component';
import { ContactDialogComponent } from '@app/features/contact/contact-dialog.component';

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
    ContactDialogComponent
  ],
  templateUrl: './dock-window.component.html',
  styleUrl: './dock-window.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DockWindowComponent {}

