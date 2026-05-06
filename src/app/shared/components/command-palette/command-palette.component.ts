import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  HostListener,
  ElementRef,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { PaletteCommand } from '@app/shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandPaletteComponent {
  private dockState = inject(DockStateService);
  private router = inject(Router);
  private searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  isOpen = signal(false);
  searchQuery = signal('');
  activeIndex = signal(0);

  private readonly allCommands: PaletteCommand[] = [
    {
      id: 'finder',
      label: 'Finder',
      description: 'Ouvrir le Finder',
      icon: '🗂',
      action: () => this.dockState.toggleFinder()
    },
    {
      id: 'terminal',
      label: 'Terminal',
      description: 'Ouvrir le Terminal',
      icon: '💻',
      shortcut: '⌃T',
      action: () => this.dockState.toggleTerminal()
    },
    {
      id: 'projects',
      label: 'Projects',
      description: 'Voir mes projets',
      icon: '🚀',
      action: () => this.dockState.toggleProjects()
    },
    {
      id: 'photos',
      label: 'Photos',
      description: 'Ouvrir la galerie photos',
      icon: '📷',
      action: () => this.dockState.toggleGalleria()
    },
    {
      id: 'contact',
      label: 'Contact',
      description: "M'envoyer un message",
      icon: '✉️',
      action: () => this.dockState.toggleMail()
    },
    {
      id: 'github',
      label: 'GitHub',
      description: 'Voir mon profil GitHub',
      icon: '🐙',
      action: () => window.open('https://github.com/mamugg', '_blank')
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      description: 'Mon profil LinkedIn',
      icon: '💼',
      action: () => window.open('https://linkedin.com/in/marc', '_blank')
    },
    {
      id: 'close-all',
      label: 'Fermer toutes les fenêtres',
      description: 'Fermer tous les dialogs ouverts',
      icon: '✕',
      action: () => {
        this.dockState.setFinder(false);
        this.dockState.setTerminal(false);
        this.dockState.setGalleria(false);
        this.dockState.setProjects(false);
        this.dockState.setMail(false);
      }
    }
  ];

  readonly filteredCommands = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allCommands;
    return this.allCommands.filter(
      cmd =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q)
    );
  });

  @HostListener('window:keydown.meta.k', ['$event'])
  @HostListener('window:keydown.control.k', ['$event'])
  open(event: Event): void {
    event.preventDefault();
    this.isOpen.set(true);
    this.searchQuery.set('');
    this.activeIndex.set(0);
    setTimeout(() => this.searchInputRef()?.nativeElement.focus(), 50);
  }

  @HostListener('window:keydown.escape')
  close(): void {
    this.isOpen.set(false);
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
    if (this.searchQuery().trim().toLowerCase() === 'void' && this.filteredCommands().length === 0) {
      this.close();
      this.router.navigate(['/404']);
      return;
    }
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
