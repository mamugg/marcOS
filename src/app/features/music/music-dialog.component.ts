import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';

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

  readonly playlist = PLAYLIST;
  readonly currentTrack = signal<Track | null>(null);

  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const track = this.currentTrack();
    if (!track) return null;
    const url = `https://www.youtube.com/embed/${track.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  /** Select a track and start playback. */
  selectTrack(track: Track): void {
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

  /** Clear current track on dialog hide. */
  onHide(): void {
    this.currentTrack.set(null);
  }
}
