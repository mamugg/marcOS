import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcher } from '@app/shared/components/theme-switcher.component';
import { MacosTopbarComponent } from '../macos-topbar/macos-topbar.component';
import { DockWindowComponent } from '../dock-window/dock-window.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [CommonModule, ThemeSwitcher, MacosTopbarComponent, DockWindowComponent],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class MainScreenComponent {
  debugMode = false;
}

