import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  private dockMenuService = inject(DockMenuService);

  menubarItems = signal<MenuItem[]>(this.dockMenuService.getMenubarItems());
  currentTime = signal<string>('');

  constructor() {
    this.updateTime();
    interval(1000).pipe(takeUntilDestroyed()).subscribe(() => this.updateTime());
  }

  private updateTime(): void {
    const now = new Date();
    const day = now.toLocaleDateString('fr-FR', { weekday: 'short' });
    const date = now.getDate();
    const month = now.toLocaleDateString('fr-FR', { month: 'short' });
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.currentTime.set(`${day} ${date} ${month} ${time}`);
  }
}
