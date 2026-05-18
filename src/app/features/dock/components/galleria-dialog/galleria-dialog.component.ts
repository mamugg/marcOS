import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  HostListener,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PhotoService } from '@app/shared/services/photo.service';
import { ErrorService } from '@app/shared/services/error.service';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { Photo } from '@app/shared/models';

@Component({
  selector: 'app-galleria-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TooltipModule, TranslatePipe],
  templateUrl: './galleria-dialog.component.html',
  styleUrl: './galleria-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhotoService]
})
export class GalleriaDialogComponent implements OnInit {
  private readonly photoService = inject(PhotoService);
  private readonly errorService = inject(ErrorService);
  private readonly translate = inject(TranslateService);
  protected readonly dockState = inject(DockStateService);

  images = signal<Photo[]>([]);
  isLoading = signal(true);
  selectedIndex = signal<number | null>(null);

  selectedPhoto = computed<Photo | null>(() => {
    const idx = this.selectedIndex();
    return idx !== null ? (this.images()[idx] ?? null) : null;
  });

  ngOnInit(): void {
    void this.loadImages();
  }

  /**
   * ESC: close lightbox first, then close the dialog
   */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selectedIndex() !== null) {
      this.selectedIndex.set(null);
    } else {
      this.dockState.setGalleria(false);
    }
  }

  openPhoto(index: number): void {
    this.selectedIndex.set(index);
  }

  closePhoto(): void {
    this.selectedIndex.set(null);
  }

  prevPhoto(): void {
    const current = this.selectedIndex();
    if (current !== null) {
      this.selectedIndex.set((current - 1 + this.images().length) % this.images().length);
    }
  }

  nextPhoto(): void {
    const current = this.selectedIndex();
    if (current !== null) {
      this.selectedIndex.set((current + 1) % this.images().length);
    }
  }

  setWallpaper(): void {
    const photo = this.selectedPhoto();
    if (photo) {
      this.dockState.setWallpaper(`url('${photo.itemImageSrc}') center/cover no-repeat`);
    }
  }

  private async loadImages(): Promise<void> {
    try {
      const data = await this.photoService.getImages();
      if (data.length > 0) {
        this.images.set(data);
      } else {
        this.errorService.handleWarning(
          this.translate.instant('galleria.error.empty'),
          this.translate.instant('galleria.error.emptyTitle')
        );
      }
    } catch (error) {
      this.errorService.handleError(error, this.translate.instant('galleria.error.load'));
    } finally {
      this.isLoading.set(false);
    }
  }
}
