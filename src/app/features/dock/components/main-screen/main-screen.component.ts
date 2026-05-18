import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '@features/dock/components/topbar/topbar.component';
import { DockWindowComponent } from '../dock-window/dock-window.component';
import { DesktopIconComponent } from '../desktop-icon/desktop-icon.component';
import { CommandPaletteComponent } from '@app/shared/components/command-palette/command-palette.component';
import { WelcomeDialogComponent } from '@features/welcome/welcome-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { SoundService } from '@app/shared/services/sound.service';
import { SoundEffectsService } from '@app/shared/services/sound-effects.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SplashScreenComponent } from '@features/splash/splash-screen.component';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [CommonModule, TopbarComponent, DockWindowComponent, DesktopIconComponent, CommandPaletteComponent, WelcomeDialogComponent, TranslatePipe, SplashScreenComponent],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainScreenComponent {
  protected dockState = inject(DockStateService);
  protected sound = inject(SoundService);

  // Bootstraps the effects that watch dialog signals for sounds.
  private readonly _soundEffects = inject(SoundEffectsService);

  onContextMenu(): void {
    this.sound.playContextMenu();
  }
}

