import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-dock',
  standalone: true,
  imports: [CommonModule, DockModule, TooltipModule],
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DockComponent {
  private dockMenuService = inject(DockMenuService);

  dockItems = signal<MenuItem[]>(this.dockMenuService.getDockItems());
}

