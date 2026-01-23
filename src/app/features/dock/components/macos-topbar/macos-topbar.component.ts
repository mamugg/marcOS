import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-macos-topbar',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './macos-topbar.component.html',
  styleUrl: './macos-topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacosTopbarComponent implements OnInit, OnDestroy {
  private dockMenuService = inject(DockMenuService);

  menubarItems = signal<MenuItem[]>(this.dockMenuService.getMenubarItems());
  currentTime = signal<string>('');
  private timeSubscription: Subscription | null = null;

  ngOnInit() {
    this.updateTime();
    this.timeSubscription = interval(1000).subscribe(() => this.updateTime());
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  private updateTime() {
    const now = new Date();
    const day = now.toLocaleDateString('fr-FR', { weekday: 'short' });
    const date = now.getDate();
    const month = now.toLocaleDateString('fr-FR', { month: 'short' });
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.currentTime.set(`${day} ${date} ${month} ${time}`);
  }
}

