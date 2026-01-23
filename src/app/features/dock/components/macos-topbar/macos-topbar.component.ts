import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-macos-topbar',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './macos-topbar.component.html',
  styleUrl: './macos-topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacosTopbarComponent {
  private dockMenuService = inject(DockMenuService);

  menubarItems = signal<MenuItem[]>(this.dockMenuService.getMenubarItems());
}

