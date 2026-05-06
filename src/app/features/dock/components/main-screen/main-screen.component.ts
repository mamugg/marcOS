import { Component, ChangeDetectionStrategy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcher } from '@app/shared/components/theme-switcher.component';
import { TopbarComponent } from '@features/dock/components/topbar/topbar.component';
import { DockWindowComponent } from '../dock-window/dock-window.component';
import { CommandPaletteComponent } from '@app/shared/components/command-palette/command-palette.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [CommonModule, ThemeSwitcher, TopbarComponent, DockWindowComponent, CommandPaletteComponent],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class MainScreenComponent {
  debugMode = false;
  wallpaperImage = '/wallpaper.png';

  private router = inject(Router);
  private konamiProgress = 0;

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === KONAMI[this.konamiProgress]) {
      this.konamiProgress++;
      if (this.konamiProgress === KONAMI.length) {
        this.konamiProgress = 0;
        this.router.navigate(['/404']);
      }
    } else {
      this.konamiProgress = event.key === KONAMI[0] ? 1 : 0;
    }
  }
}

