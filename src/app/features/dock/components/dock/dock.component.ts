import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { DockSizeService } from '@app/shared/services/dock-size.service';
import { AccentColorService } from '@app/shared/services/accent-color.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private translate = inject(TranslateService);
  readonly dockSize = inject(DockSizeService);
  // Injected here to ensure CSS vars are applied before first render
  private readonly _accent = inject(AccentColorService);

  dockItems = signal<MenuItem[]>(this.dockMenuService.getDockItems());

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.dockItems.set(this.dockMenuService.getDockItems()));
  }
}

