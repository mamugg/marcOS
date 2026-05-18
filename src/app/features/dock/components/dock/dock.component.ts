import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { DockSizeService } from '@app/shared/services/dock-size.service';
import { AccentColorService } from '@app/shared/services/accent-color.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Scale applied at each distance from the hovered item (index = distance) */
const SCALE_AT_DISTANCE: readonly number[] = [1.35, 1.18, 1.08];

@Component({
  selector: 'app-dock',
  standalone: true,
  imports: [TooltipModule, TranslatePipe],
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DockComponent {
  private readonly dockMenuService = inject(DockMenuService);
  private readonly translate = inject(TranslateService);
  readonly dockSize = inject(DockSizeService);
  // Injected here to ensure CSS vars are applied before first render
  private readonly _accent = inject(AccentColorService);

  readonly dockItems = signal<MenuItem[]>(this.dockMenuService.getDockItems());
  readonly hoveredIndex = signal<number | null>(null);

  /**
   * CSS transform string for each dock item based on distance from hovered index.
   * Items grow upward via scale + translateY anchored at bottom-center.
   */
  readonly itemTransforms = computed<ReadonlyArray<string>>(() => {
    const items = this.dockItems();
    const hovered = this.hoveredIndex();
    return items.map((_, idx) => {
      if (hovered === null) return 'scale(1) translateY(0)';
      const dist = Math.abs(idx - hovered);
      const scale = SCALE_AT_DISTANCE[dist] ?? 1;
      const ty = Math.round((scale - 1) * 18);
      return `scale(${scale}) translateY(-${ty}px)`;
    });
  });

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.dockItems.set(this.dockMenuService.getDockItems()));
  }

  /**
   * Set hovered item index to drive magnification
   */
  setHovered(index: number): void {
    this.hoveredIndex.set(index);
  }

  /**
   * Clear magnification state when mouse leaves the dock
   */
  clearHovered(): void {
    this.hoveredIndex.set(null);
  }

  /**
   * Execute a dock item: navigate to URL or run its command
   */
  executeItem(event: MouseEvent, item: MenuItem): void {
    if (item.url) return;
    event.preventDefault();
    item.command?.({ originalEvent: event, item });
  }
}
