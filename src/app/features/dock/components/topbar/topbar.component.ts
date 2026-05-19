import {
  Component, ChangeDetectionStrategy, inject, signal, computed, viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';
import { SliderModule } from 'primeng/slider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ThemeService } from '@app/shared/services/theme.service';
import { SoundService } from '@app/shared/services/sound.service';
import { MessageService } from 'primeng/api';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Popover } from 'primeng/popover';

const LOGO_CLICK_TARGET = 7;
const LOGO_CLICK_WINDOW_MS = 2500;

interface WifiNetwork {
  name: string;
  bars: number;
  secured: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, PopoverModule, SliderModule, ToggleSwitchModule, FormsModule, TranslatePipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  private dockMenuService = inject(DockMenuService);
  protected readonly dockStateService = inject(DockStateService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private messageService = inject(MessageService);
  readonly localeService = inject(LocaleService);
  readonly themeService = inject(ThemeService);
  readonly soundService = inject(SoundService);

  private readonly wifiPanel = viewChild<Popover>('wifiPanel');
  private readonly volumePanel = viewChild<Popover>('volumePanel');
  private readonly controlPanel = viewChild<Popover>('controlPanel');

  menubarItems = signal<MenuItem[]>(this.dockMenuService.getMenubarItems());
  currentTime = signal<string>('');

  /** Local copy of volume for the slider (two-way binding). */
  sliderVolume = signal<number>(this.soundService.volume());

  readonly volumeIcon = computed(() => {
    if (!this.soundService.soundEnabled() || this.soundService.volume() === 0) return 'pi pi-volume-off';
    if (this.soundService.volume() < 40) return 'pi pi-volume-down';
    return 'pi pi-volume-up';
  });

  readonly wifiNetworks: WifiNetwork[] = [
    { name: "Marco's Creative Brain™", bars: 4, secured: true },
    { name: 'Portfolio_5G', bars: 4, secured: false },
    { name: '🥚 HIDDEN_EASTEREGG', bars: 1, secured: true },
  ];

  private logoClickTimestamps: number[] = [];

  constructor() {
    this.updateTime();
    interval(1000).pipe(takeUntilDestroyed()).subscribe(() => this.updateTime());

    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.menubarItems.set(this.dockMenuService.getMenubarItems());
        this.updateTime();
      });
  }

  /** 7 clicks within 2.5s on the logo redirects to the 404 page. */
  onLogoClick(): void {
    const now = Date.now();
    this.logoClickTimestamps = this.logoClickTimestamps.filter(t => now - t < LOGO_CLICK_WINDOW_MS);
    this.logoClickTimestamps.push(now);
    if (this.logoClickTimestamps.length >= LOGO_CLICK_TARGET) {
      this.logoClickTimestamps = [];
      this.router.navigate(['/404']);
    }
  }

  onWifiClick(event: MouseEvent): void {
    this.wifiPanel()?.toggle(event);
  }

  onVolumeClick(event: MouseEvent): void {
    this.sliderVolume.set(this.soundService.volume());
    this.volumePanel()?.toggle(event);
  }

  onNotificationCenterClick(): void {
    this.dockStateService.toggleNotificationCenter();
  }

  onSearchClick(): void {
    this.dockStateService.toggleCommandPalette();
  }

  onControlClick(event: MouseEvent): void {
    this.controlPanel()?.toggle(event);
  }

  onVolumeChange(value: number | number[]): void {
    const v = Array.isArray(value) ? value[0] : value;
    this.soundService.setVolume(v);
    this.sliderVolume.set(v);
  }

  onMuteToggle(): void {
    this.soundService.setSoundEnabled(!this.soundService.soundEnabled());
  }

  joinNetwork(network: WifiNetwork): void {
    this.wifiPanel()?.hide();
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('topbar.wifi.joined'),
      detail: network.name,
      life: 3000,
      key: 'tc'
    });
  }

  toggleLanguage(): void {
    const next = this.localeService.locale() === 'fr' ? 'en' : 'fr';
    this.localeService.setLocale(next);
  }

  openSettings(): void {
    this.controlPanel()?.hide();
    this.dockStateService.setSettings(true);
  }

  private updateTime(): void {
    const now = new Date();
    const lc = this.localeService.locale() === 'en' ? 'en-US' : 'fr-FR';
    const day = now.toLocaleDateString(lc, { weekday: 'short' });
    const date = now.getDate();
    const month = now.toLocaleDateString(lc, { month: 'short' });
    const time = now.toLocaleTimeString(lc, { hour: '2-digit', minute: '2-digit' });
    this.currentTime.set(`${day} ${date} ${month} ${time}`);
  }
}
