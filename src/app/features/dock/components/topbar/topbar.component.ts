import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const LOGO_CLICK_TARGET = 7;
const LOGO_CLICK_WINDOW_MS = 2500;

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
  private router = inject(Router);

  menubarItems = signal<MenuItem[]>(this.dockMenuService.getMenubarItems());
  currentTime = signal<string>('');

  private logoClickTimestamps: number[] = [];

  constructor() {
    this.updateTime();
    interval(1000).pipe(takeUntilDestroyed()).subscribe(() => this.updateTime());
  }

  /** 7 clicks within 2.5s on the logo redirects to the 404 page. */
  onLogoClick(): void {
    const now = Date.now();
    this.logoClickTimestamps = this.logoClickTimestamps.filter(t => now - t < LOGO_CLICK_WINDOW_MS);
    this.logoClickTimestamps.push(now);
    if (this.logoClickTimestamps.length >= LOGO_CLICK_TARGET) {
      this.logoClickTimestamps = [];
      this.router.navigate(['/404']);
    }
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
