import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DocType = 'pdf' | 'txt';

@Component({
  selector: 'app-desktop-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desktop-icon.component.html',
  styleUrl: './desktop-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesktopIconComponent {
  readonly label = input<string>('');
  readonly docType = input<DocType>('txt');

  /** Emitted on double-click or Enter/Space key press. */
  readonly opened = output<void>();

  protected readonly selected = signal(false);
  private lastClickTime = 0;

  /** Handle single/double click to select or open. */
  onClick(): void {
    const now = Date.now();
    if (now - this.lastClickTime < 400) {
      this.opened.emit();
      this.selected.set(false);
    } else {
      this.selected.set(true);
    }
    this.lastClickTime = now;
  }

  onBlur(): void {
    this.selected.set(false);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.opened.emit();
    }
    if (event.key === 'Escape') {
      this.selected.set(false);
    }
  }
}
