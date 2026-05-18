import {
  Component,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const SPLASH_DURATION_MS = 3200;

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="splash-overlay" [class.splash-exit]="exiting()">
        <div class="splash-content">
          <img src="/logo.png" alt="marcOS" class="splash-logo" />
          <div class="splash-bar-track" role="progressbar" aria-label="Loading…">
            <div class="splash-bar-fill"></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .splash-overlay {
        position: fixed;
        inset: 0;
        z-index: 9998;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: splash-fade-in 0.4s ease forwards;
      }

      .splash-overlay.splash-exit {
        animation: splash-fade-out 0.5s ease forwards;
      }

      @keyframes splash-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes splash-fade-out {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      .splash-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 48px;
      }

      .splash-logo {
        width: 80px;
        height: 80px;
        object-fit: contain;
        filter: brightness(0) invert(1);
        animation: splash-logo-appear 0.6s ease 0.2s both;
      }

      @keyframes splash-logo-appear {
        from {
          opacity: 0;
          transform: scale(0.85);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .splash-bar-track {
        width: 200px;
        height: 4px;
        background: rgba(255 255 255 / 0.15);
        border-radius: 2px;
        overflow: hidden;
      }

      .splash-bar-fill {
        height: 100%;
        width: 0;
        background: #fff;
        border-radius: 2px;
        animation: splash-progress 2.4s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
      }

      @keyframes splash-progress {
        0% {
          width: 0%;
        }
        40% {
          width: 55%;
        }
        75% {
          width: 82%;
        }
        95% {
          width: 96%;
        }
        100% {
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly visible = signal(true);
  readonly exiting = signal(false);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (sessionStorage.getItem('marcOS_skipSplash') === '1') {
      sessionStorage.removeItem('marcOS_skipSplash');
      this.visible.set(false);
      return;
    }

    setTimeout(() => {
      this.exiting.set(true);
      setTimeout(() => this.visible.set(false), 500);
    }, SPLASH_DURATION_MS - 500);
  }
}
