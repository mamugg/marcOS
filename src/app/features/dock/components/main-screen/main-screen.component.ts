import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcher } from '@app/shared/components/theme-switcher.component';
import { TopbarComponent } from '@features/dock/components/topbar/topbar.component';
import { DockWindowComponent } from '../dock-window/dock-window.component';
import { CommandPaletteComponent } from '@app/shared/components/command-palette/command-palette.component';
import { MessageService } from 'primeng/api';

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
}

