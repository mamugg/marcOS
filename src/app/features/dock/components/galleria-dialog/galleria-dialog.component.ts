import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoService } from '@app/shared/services/photo.service';
import { ErrorService } from '@app/shared/services/error.service';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { Photo } from '@app/shared/models';

interface GalleriaResponsiveOption {
  breakpoint: string;
  numVisible: number;
}

@Component({
  selector: 'app-galleria-dialog',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './galleria-dialog.component.html',
  styleUrl: './galleria-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhotoService]
})
export class GalleriaDialogComponent implements OnInit {
  private photoService = inject(PhotoService);
  private errorService = inject(ErrorService);
  protected dockState = inject(DockStateService);

  images = signal<Photo[]>([]);
  isLoading = signal(true);
  responsiveOptions = signal<GalleriaResponsiveOption[]>([
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 }
  ]);

  ngOnInit(): void {
    this.loadImages();
  }

  private loadImages(): void {
    this.photoService
      .getImages()
      .then(data => {
        if (data.length > 0) {
          this.images.set(data);
        } else {
          this.errorService.handleWarning('Aucune image disponible', 'Galerie vide');
        }
        this.isLoading.set(false);
      })
      .catch((error: unknown) => {
        this.errorService.handleError(error, 'Erreur de chargement images');
        this.isLoading.set(false);
      });
  }
}
