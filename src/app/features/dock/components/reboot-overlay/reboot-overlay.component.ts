import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';

@Component({
  selector: 'app-reboot-overlay',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    @if (dockState.rebooting()) {
      <div class="reboot-overlay">
        <img src="/logo.png" alt="marcOS" class="reboot-logo" />
        <div class="reboot-bar-track">
          <div class="reboot-bar-fill"></div>
        </div>
        <p class="reboot-label">{{ 'reboot.label' | translate }}</p>
      </div>
    }
  `,
  styles: [`
    .reboot-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 28px;
      animation: reboot-fade-in 0.5s ease forwards;
    }

    @keyframes reboot-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .reboot-logo {
      width: 72px;
      height: 72px;
      object-fit: contain;
      filter: brightness(0) invert(1);
      animation: reboot-pulse 1.2s ease-in-out infinite;
    }

    @keyframes reboot-pulse {
      0%, 100% { opacity: 0.55; }
      50%       { opacity: 1;    }
    }

    .reboot-bar-track {
      width: 180px;
      height: 3px;
      background: rgba(255 255 255 / .18);
      border-radius: 2px;
      overflow: hidden;
    }

    .reboot-bar-fill {
      height: 100%;
      width: 0;
      background: #fff;
      border-radius: 2px;
      animation: reboot-progress 2.6s cubic-bezier(.4,0,.2,1) forwards;
    }

    @keyframes reboot-progress {
      0%   { width: 0%; }
      60%  { width: 75%; }
      90%  { width: 92%; }
      100% { width: 100%; }
    }

    .reboot-label {
      margin: 0;
      color: rgba(255 255 255 / .4);
      font-size: 0.72rem;
      letter-spacing: 0.4px;
      font-family: -apple-system, BlinkMacSystemFont, 'Poppins', sans-serif;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RebootOverlayComponent {
  readonly dockState = inject(DockStateService);

  constructor() {
    effect(() => {
      if (this.dockState.rebooting()) {
        setTimeout(() => window.location.reload(), 3000);
      }
    });
  }
}
