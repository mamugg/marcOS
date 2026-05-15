import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
  HostListener,
  ElementRef,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { PaletteCommand } from '@app/shared/models';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandPaletteComponent {
  private readonly dockState = inject(DockStateService);
  private readonly translate = inject(TranslateService);
  private readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /** Reactive signal that fires on each language change — drives command label recomputation. */
  private readonly langChanged = toSignal(this.translate.onLangChange);

  isOpen = this.dockState.displayCommandPalette;
  searchQuery = signal('');
  activeIndex = signal(0);

  constructor() {
    effect(() => {
      if (this.dockState.displayCommandPalette()) {
        this.searchQuery.set('');
        this.activeIndex.set(0);
        setTimeout(() => this.searchInputRef()?.nativeElement.focus(), 50);
      }
    });
  }

  private readonly allCommands = computed<PaletteCommand[]>(() => {
    this.langChanged(); // reactive dependency — recompute on language switch
    const t = (key: string) => this.translate.instant(key);
    return [
      {
        id: 'finder',
        label: t('palette.finder.label'),
        description: t('palette.finder.desc'),
        icon: '🗂',
        action: () => this.dockState.toggleFinder()
      },
      {
        id: 'terminal',
        label: t('palette.terminal.label'),
        description: t('palette.terminal.desc'),
        icon: '💻',
        shortcut: '⌃T',
        action: () => this.dockState.toggleTerminal()
      },
      {
        id: 'projects',
        label: t('palette.projects.label'),
        description: t('palette.projects.desc'),
        icon: '🚀',
        action: () => this.dockState.toggleProjects()
      },
      {
        id: 'photos',
        label: t('palette.photos.label'),
        description: t('palette.photos.desc'),
        icon: '📷',
        action: () => this.dockState.toggleGalleria()
      },
      {
        id: 'contact',
        label: t('palette.contact.label'),
        description: t('palette.contact.desc'),
        icon: '✉️',
        action: () => this.dockState.toggleMail()
      },
      {
        id: 'github',
        label: t('palette.github.label'),
        description: t('palette.github.desc'),
        icon: '🐙',
        action: () => window.open('https://github.com/mamugg', '_blank')
      },
      {
        id: 'linkedin',
        label: t('palette.linkedin.label'),
        description: t('palette.linkedin.desc'),
        icon: '💼',
        action: () => window.open('https://linkedin.com/in/marc-antoine-muggeo-87b794180', '_blank')
      },
      {
        id: 'close-all',
        label: t('palette.closeAll.label'),
        description: t('palette.closeAll.desc'),
        icon: '✕',
        action: () => this.dockState.closeAll()
      }
    ];
  });

  readonly filteredCommands = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allCommands();
    return this.allCommands().filter(
      cmd =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q)
    );
  });

  @HostListener('window:keydown.meta.k', ['$event'])
  @HostListener('window:keydown.control.k', ['$event'])
  open(event: Event): void {
    event.preventDefault();
    this.dockState.setCommandPalette(true);
  }

  @HostListener('window:keydown.escape')
  close(): void {
    this.dockState.setCommandPalette(false);
  }

  @HostListener('window:keydown.arrowDown', ['$event'])
  onArrowDown(event: Event): void {
    if (!this.isOpen()) return;
    event.preventDefault();
    const max = this.filteredCommands().length - 1;
    this.activeIndex.update(i => (i < max ? i + 1 : 0));
  }

  @HostListener('window:keydown.arrowUp', ['$event'])
  onArrowUp(event: Event): void {
    if (!this.isOpen()) return;
    event.preventDefault();
    const max = this.filteredCommands().length - 1;
    this.activeIndex.update(i => (i > 0 ? i - 1 : max));
  }

  @HostListener('window:keydown.enter', ['$event'])
  onEnter(event: Event): void {
    if (!this.isOpen()) return;
    event.preventDefault();
    const cmd = this.filteredCommands()[this.activeIndex()];
    if (cmd) this.execute(cmd);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.activeIndex.set(0);
  }

  execute(command: PaletteCommand): void {
    command.action();
    this.close();
  }

  closeOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('palette-overlay')) {
      this.close();
    }
  }
}
