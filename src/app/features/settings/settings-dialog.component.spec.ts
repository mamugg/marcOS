import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { vi } from 'vitest';
import { TranslateService } from '@ngx-translate/core';
import { SettingsDialogComponent, WALLPAPER_OPTIONS } from './settings-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { ThemeService } from '@app/shared/services/theme.service';
import { SoundService } from '@app/shared/services/sound.service';
import { LocaleService } from '@app/shared/services/locale.service';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;

  const mockWallpaper = signal(WALLPAPER_OPTIONS[0].value);
  const mockDisplaySettings = signal(false);
  const mockIsDark = signal(false);
  const mockSoundEnabled = signal(true);

  const dockStateMock = {
    wallpaper: mockWallpaper,
    displaySettings: mockDisplaySettings,
    setWallpaper: vi.fn(),
    reboot: vi.fn()
  };

  const themeMock = {
    isDark: mockIsDark,
    setTheme: vi.fn(),
    toggleTheme: vi.fn()
  };

  const soundServiceMock = {
    soundEnabled: mockSoundEnabled,
    setSoundEnabled: vi.fn((v: boolean) => mockSoundEnabled.set(v)),
    volume: signal(80),
    gainFactor: signal(0.8),
    setVolume: vi.fn()
  };

  const localeServiceMock = {
    locale: signal('fr'),
    setLocale: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSoundEnabled.set(true);

    await TestBed.configureTestingModule({
      imports: [SettingsDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        { provide: ThemeService, useValue: themeMock },
        { provide: SoundService, useValue: soundServiceMock },
        { provide: LocaleService, useValue: localeServiceMock },
        { provide: TranslateService, useValue: { instant: (k: string) => k, onLangChange: EMPTY, use: vi.fn() } }
      ]
    })
      .overrideComponent(SettingsDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(SettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose all wallpaper options', () => {
    expect(component.wallpapers).toHaveLength(WALLPAPER_OPTIONS.length);
    expect(component.wallpapers[0].id).toBe('sonoma');
  });

  it('selectWallpaper() delegates to dockState.setWallpaper', () => {
    const wp = WALLPAPER_OPTIONS[2];
    component.selectWallpaper(wp);
    expect(dockStateMock.setWallpaper).toHaveBeenCalledWith(wp.value);
  });

  it('isSelected() returns true only for the active wallpaper', () => {
    mockWallpaper.set(WALLPAPER_OPTIONS[1].value);
    expect(component.isSelected(WALLPAPER_OPTIONS[1])).toBe(true);
    expect(component.isSelected(WALLPAPER_OPTIONS[0])).toBe(false);
  });

  it('currentWallpaperName() returns the label of the matched wallpaper', () => {
    mockWallpaper.set(WALLPAPER_OPTIONS[3].value);
    expect(component.currentWallpaperName()).toBe(WALLPAPER_OPTIONS[3].label);
  });

  it('currentWallpaperName() returns "Custom" for an unknown value', () => {
    mockWallpaper.set('some-unknown-value');
    expect(component.currentWallpaperName()).toBe('Custom');
  });

  it('isDark getter reflects themeService.isDark signal', () => {
    mockIsDark.set(false);
    expect(component.isDark).toBe(false);

    mockIsDark.set(true);
    expect(component.isDark).toBe(true);
  });

  it('isDark setter calls themeService.setTheme', () => {
    component.isDark = true;
    expect(themeMock.setTheme).toHaveBeenCalledWith(true);

    component.isDark = false;
    expect(themeMock.setTheme).toHaveBeenCalledWith(false);
  });

  it('soundEnabled getter reflects soundService.soundEnabled signal', () => {
    mockSoundEnabled.set(true);
    expect(component.soundEnabled).toBe(true);

    mockSoundEnabled.set(false);
    expect(component.soundEnabled).toBe(false);
  });

  it('soundEnabled setter calls soundService.setSoundEnabled', () => {
    component.soundEnabled = false;
    expect(soundServiceMock.setSoundEnabled).toHaveBeenCalledWith(false);
  });

  it('setLocale() delegates to localeService.setLocale', () => {
    component.setLocale('en');
    expect(localeServiceMock.setLocale).toHaveBeenCalledWith('en');
  });

  it('confirmReboot() calls dockState.reboot', () => {
    component.confirmReboot();
    expect(dockStateMock.reboot).toHaveBeenCalled();
  });

  it('onFileSelected() does nothing when no file is selected', () => {
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: null });
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: input });
    expect(() => component.onFileSelected(event)).not.toThrow();
  });

  it('onFileSelected() does nothing for non-image files', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: input });
    component.onFileSelected(event);
    expect(dockStateMock.setWallpaper).not.toHaveBeenCalled();
  });
});
