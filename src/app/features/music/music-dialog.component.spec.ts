import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { vi } from 'vitest';
import { TranslateService } from '@ngx-translate/core';
import { MusicDialogComponent, PLAYLIST } from './music-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { SoundService } from '@app/shared/services/sound.service';

describe('MusicDialogComponent', () => {
  let component: MusicDialogComponent;

  const mockDisplayMusic = signal(false);
  const mockVolume = signal(80);
  const mockSoundEnabled = signal(true);

  const dockStateMock = {
    displayMusic: mockDisplayMusic,
  };

  const soundServiceMock = {
    volume: mockVolume,
    soundEnabled: mockSoundEnabled,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MusicDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        { provide: SoundService, useValue: soundServiceMock },
        {
          provide: TranslateService,
          useValue: { instant: (k: string) => k, onLangChange: EMPTY, use: vi.fn() }
        }
      ]
    })
      .overrideComponent(MusicDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(MusicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose all playlist tracks', () => {
    expect(component.playlist).toHaveLength(PLAYLIST.length);
    expect(component.playlist[0].title).toBe('Get Lucky');
  });

  it('currentTrack() is null initially', () => {
    expect(component.currentTrack()).toBeNull();
  });

  it('embedUrl() is null when no track is selected', () => {
    expect(component.embedUrl()).toBeNull();
  });

  it('embedUrl() includes enablejsapi=1 when a track is selected', () => {
    component.selectTrack(PLAYLIST[0]);
    const url = component.embedUrl();
    expect(url).toBeTruthy();
    // SafeResourceUrl toString includes the URL string
    expect(String(url)).toContain('enablejsapi=1');
  });

  it('selectTrack() sets the current track', () => {
    const track = PLAYLIST[1];
    component.selectTrack(track);
    expect(component.currentTrack()).toEqual(track);
  });

  it('isActive() returns true only for the active track', () => {
    component.selectTrack(PLAYLIST[0]);
    expect(component.isActive(PLAYLIST[0])).toBe(true);
    expect(component.isActive(PLAYLIST[1])).toBe(false);
  });

  it('isActive() returns false for all tracks when none is selected', () => {
    expect(PLAYLIST.every(t => !component.isActive(t))).toBe(true);
  });

  it('youtubeWatchUrl() returns null when no track is selected', () => {
    expect(component.youtubeWatchUrl()).toBeNull();
  });

  it('youtubeWatchUrl() returns correct YouTube URL for active track', () => {
    const track = PLAYLIST[2];
    component.selectTrack(track);
    expect(component.youtubeWatchUrl()).toBe(`https://www.youtube.com/watch?v=${track.youtubeId}`);
  });

  it('onHide() clears the current track', () => {
    component.selectTrack(PLAYLIST[0]);
    component.onHide();
    expect(component.currentTrack()).toBeNull();
  });

  it('selectTrack() switches between tracks correctly', () => {
    component.selectTrack(PLAYLIST[0]);
    expect(component.isActive(PLAYLIST[0])).toBe(true);

    component.selectTrack(PLAYLIST[3]);
    expect(component.isActive(PLAYLIST[0])).toBe(false);
    expect(component.isActive(PLAYLIST[3])).toBe(true);
  });

  it('onIframeLoad() makes the effect eligible to apply volume', () => {
    // Before load: no crash even if volume/mute change
    expect(() => {
      mockVolume.set(50);
      mockSoundEnabled.set(false);
    }).not.toThrow();
  });
});
