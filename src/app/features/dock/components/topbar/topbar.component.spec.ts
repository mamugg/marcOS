import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TopbarComponent } from './topbar.component';
import { DockMenuService } from '@features/dock/services/dock-menu.service';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { SoundService } from '@app/shared/services/sound.service';
import { ThemeService } from '@app/shared/services/theme.service';
import { LocaleService } from '@app/shared/services/locale.service';

describe('TopbarComponent', () => {
  let fixture: ComponentFixture<TopbarComponent>;
  let component: TopbarComponent;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let toggleCommandPaletteSpy: ReturnType<typeof vi.fn>;
  let messageAddSpy: ReturnType<typeof vi.fn>;

  const mockMenubarItems: MenuItem[] = [
    { label: 'Finder' },
    { label: 'File' }
  ];

  const mockSoundService = {
    volume: vi.fn().mockReturnValue(80),
    soundEnabled: vi.fn().mockReturnValue(true),
    gainFactor: vi.fn().mockReturnValue(0.8),
    setVolume: vi.fn(),
    setSoundEnabled: vi.fn(),
    playNotification: vi.fn(),
    playError: vi.fn(),
  };

  const mockThemeService = {
    isDark: vi.fn().mockReturnValue(false),
    toggleTheme: vi.fn(),
  };

  const mockLocaleService = {
    locale: vi.fn().mockReturnValue('fr'),
    setLocale: vi.fn(),
  };

  beforeEach(async () => {
    navigateSpy = vi.fn();
    toggleCommandPaletteSpy = vi.fn();
    messageAddSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        { provide: DockMenuService, useValue: { getMenubarItems: () => mockMenubarItems } },
        { provide: DockStateService, useValue: { toggleCommandPalette: toggleCommandPaletteSpy, setSettings: vi.fn() } },
        { provide: Router, useValue: { navigate: navigateSpy } },
        { provide: TranslateService, useValue: { instant: (k: string) => k, onLangChange: EMPTY, use: vi.fn() } },
        { provide: MessageService, useValue: { add: messageAddSpy } },
        { provide: SoundService, useValue: mockSoundService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: LocaleService, useValue: mockLocaleService },
      ]
    })
      .overrideComponent(TopbarComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (fixture?.destroy) fixture.destroy();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menubarItems from DockMenuService', () => {
    expect(component.menubarItems()).toEqual(mockMenubarItems);
  });

  it('should set currentTime after detectChanges', () => {
    fixture.detectChanges();
    expect(component.currentTime()).toBeTruthy();
  });

  it('should format currentTime with more than 5 chars', () => {
    fixture.detectChanges();
    expect(component.currentTime().length).toBeGreaterThan(5);
  });

  it('should destroy without throwing', () => {
    fixture.detectChanges();
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should not navigate before 7 logo clicks', () => {
    for (let i = 0; i < 6; i++) component.onLogoClick();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate to /404 on 7 logo clicks', () => {
    for (let i = 0; i < 7; i++) component.onLogoClick();
    expect(navigateSpy).toHaveBeenCalledWith(['/404']);
  });

  it('should reset click counter after triggering navigation', () => {
    for (let i = 0; i < 7; i++) component.onLogoClick();
    navigateSpy.mockClear();
    for (let i = 0; i < 6; i++) component.onLogoClick();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should call toggleCommandPalette on search click', () => {
    component.onSearchClick();
    expect(toggleCommandPaletteSpy).toHaveBeenCalledOnce();
  });

  it('should call soundService.setSoundEnabled on mute toggle', () => {
    component.onMuteToggle();
    expect(mockSoundService.setSoundEnabled).toHaveBeenCalledWith(false);
  });

  it('should call soundService.setVolume on volume change', () => {
    component.onVolumeChange(65);
    expect(mockSoundService.setVolume).toHaveBeenCalledWith(65);
  });

  it('should update sliderVolume on volume change', () => {
    component.onVolumeChange(42);
    expect(component.sliderVolume()).toBe(42);
  });

  it('should call setLocale with toggled locale', () => {
    component.toggleLanguage();
    expect(mockLocaleService.setLocale).toHaveBeenCalledWith('en');
  });

  it('should show a toast on joinNetwork', () => {
    const net = { name: 'TestNet', bars: 3, secured: false };
    component.joinNetwork(net);
    expect(messageAddSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: 'TestNet' }));
  });

  it('should expose 5 fake wifi networks', () => {
    expect(component.wifiNetworks.length).toBe(5);
  });
});
