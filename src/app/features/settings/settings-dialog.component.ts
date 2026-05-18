import { Component, ChangeDetectionStrategy, ElementRef, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TranslatePipe } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { ThemeService } from '@app/shared/services/theme.service';
import { AccentColorService, ACCENT_COLORS } from '@app/shared/services/accent-color.service';
import { LocaleService, Locale } from '@app/shared/services/locale.service';
import { SoundService } from '@app/shared/services/sound.service';
import { DockSizeService, DOCK_SIZES } from '@app/shared/services/dock-size.service';

export interface WallpaperOption {
  id: string;
  label: string;
  value: string;
}

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  { id: 'sonoma',   label: 'Sonoma',    value: "url('wallpaper.png') center/cover no-repeat" },
  { id: 'midnight', label: 'Midnight',  value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { id: 'ocean',    label: 'Ocean',     value: 'linear-gradient(135deg, #000046 0%, #1cb5e0 100%)' },
  { id: 'aurora',   label: 'Aurora',    value: 'linear-gradient(135deg, #0652DD 0%, #9f6ef7 50%, #00d2d3 100%)' },
  { id: 'sunset',   label: 'Sunset',    value: 'linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #e84040 100%)' },
  { id: 'forest',   label: 'Forest',    value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { id: 'rose',     label: 'Rose',      value: 'linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)' },
  { id: 'graphite', label: 'Graphite',  value: 'linear-gradient(135deg, #2c3e50 0%, #bdc3c7 100%)' },
];

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, TabsModule, ToggleSwitchModule, TranslatePipe],
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsDialogComponent {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly dockState = inject(DockStateService);
  protected readonly themeService = inject(ThemeService);
  protected readonly accentService = inject(AccentColorService);
  protected readonly localeService = inject(LocaleService);
  protected readonly soundService = inject(SoundService);
  protected readonly dockSizeService = inject(DockSizeService);

  readonly wallpapers = WALLPAPER_OPTIONS;
  readonly accentColors = ACCENT_COLORS;
  readonly dockSizes = DOCK_SIZES;

  get isDark(): boolean { return this.themeService.isDark(); }
  set isDark(v: boolean) { this.themeService.setTheme(v); }

  get soundEnabled(): boolean { return this.soundService.soundEnabled(); }
  set soundEnabled(v: boolean) { this.soundService.setSoundEnabled(v); }

  /** Apply a wallpaper preset. */
  selectWallpaper(wallpaper: WallpaperOption): void {
    this.dockState.setWallpaper(wallpaper.value);
  }

  isSelected(wallpaper: WallpaperOption): boolean {
    return this.dockState.wallpaper() === wallpaper.value;
  }

  currentWallpaperName(): string {
    return this.wallpapers.find(w => w.value === this.dockState.wallpaper())?.label ?? 'Custom';
  }

  /** Open the hidden file picker. */
  openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  /** Read the selected image file as a base64 data URL and apply it as wallpaper. */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;
      this.dockState.setWallpaper(`url('${dataUrl}') center/cover no-repeat`);
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  setLocale(locale: Locale): void {
    this.localeService.setLocale(locale);
  }

  confirmReboot(): void {
    this.dockState.reboot();
  }
}
