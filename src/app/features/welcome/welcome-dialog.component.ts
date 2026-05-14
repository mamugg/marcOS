import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { SoundService } from '@app/shared/services/sound.service';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TranslatePipe],
  templateUrl: './welcome-dialog.component.html',
  styleUrl: './welcome-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeDialogComponent {
  protected dockState = inject(DockStateService);
  private sound = inject(SoundService);

  readonly tips = [
    { icon: '🖥️', key: 'welcome.tip.dock' },
    { icon: '📌', key: 'welcome.tip.topbar' },
    { icon: '⌨️', key: 'welcome.tip.palette' }
  ];

  /**
   * Persist the dismissal and play the startup chime — the button click
   * satisfies browser autoplay policy, so the sound is guaranteed to work.
   */
  dismiss(): void {
    this.sound.playBoot();
    this.dockState.dismissWelcome();
  }
}
