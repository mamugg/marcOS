import {
  Component, ChangeDetectionStrategy, inject, signal, computed, effect, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { SoundService } from '@app/shared/services/sound.service';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  youtubeId: string;
  duration: string;
}

export const PLAYLIST: Track[] = [
  { id: '1', title: 'Get Lucky',       artist: 'Daft Punk ft. Pharrell Williams', album: 'Random Access Memories',        youtubeId: '5NV6Rdv1h3Q', duration: '6:09' },
  { id: '2', title: 'Alors on danse',  artist: 'Stromae',                         album: 'Cheese',                        youtubeId: 'iMoraes55GI', duration: '3:43' },
  { id: '3', title: 'Midnight City',   artist: 'M83',                             album: "Hurry Up, We're Dreaming",      youtubeId: 'dX3k_QDnzHE', duration: '4:03' },
  { id: '4', title: 'Lisztomania',     artist: 'Phoenix',                         album: 'Wolfgang Amadeus Phoenix',      youtubeId: 'euCnTLcfbkM', duration: '3:38' },
  { id: '5', title: 'D.A.N.C.E.',      artist: 'Justice',                         album: '†',                             youtubeId: 'yFKjRJxHBFM', duration: '3:38' },
  { id: '6', title: 'Nightcall',       artist: 'Kavinsky',                        album: 'OutRun',                        youtubeId: 'MV_3Dpw-BRY', duration: '4:17' },
];

@Component({
  selector: 'app-music-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe],
  templateUrl: './music-dialog.component.html',
  styleUrl: './music-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicDialogComponent {
  protected readonly dockState = inject(DockStateService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly soundService = inject(SoundService);

  @ViewChild('ytIframe') private ytIframe?: ElementRef<HTMLIFrameElement>;

  readonly playlist = PLAYLIST;
  readonly currentTrack = signal<Track | null>(null);

  /** True once the current iframe has finished loading and accepts postMessage commands. */
  private readonly iframeLoaded = signal(false);

  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const track = this.currentTrack();
    if (!track) return null;
    const url = `https://www.youtube.com/embed/${track.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  constructor() {
    // Sync SoundService volume/mute to the YouTube iframe via postMessage.
    // Reads all three signals so the effect re-runs on any of their changes.
    effect(() => {
      const volume = this.soundService.volume();
      const enabled = this.soundService.soundEnabled();
      if (this.iframeLoaded()) {
        this.applyVolumeToIframe(volume, enabled);
      }
    });
  }

  /** Select a track and start playback. */
  selectTrack(track: Track): void {
    this.iframeLoaded.set(false); // reset before new iframe loads
    this.currentTrack.set(track);
  }

  /** Returns true if the given track is the active one. */
  isActive(track: Track): boolean {
    return this.currentTrack()?.id === track.id;
  }

  /** Returns the YouTube watch URL for the current track. */
  youtubeWatchUrl(): string | null {
    const track = this.currentTrack();
    return track ? `https://www.youtube.com/watch?v=${track.youtubeId}` : null;
  }

  /** Called when the YouTube iframe fires its load event. */
  onIframeLoad(): void {
    this.iframeLoaded.set(true);
  }

  /** Clear current track on dialog hide. */
  onHide(): void {
    this.currentTrack.set(null);
    this.iframeLoaded.set(false);
  }

  /**
   * Send volume/mute commands to the YouTube IFrame player via postMessage.
   * Requires enablejsapi=1 in the embed URL.
   */
  private applyVolumeToIframe(volume: number, enabled: boolean): void {
    const win = this.ytIframe?.nativeElement?.contentWindow;
    if (!win) return;

    if (!enabled) {
      win.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
    } else {
      win.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
      win.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [volume] }), '*');
    }
  }
}
