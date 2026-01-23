import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoService } from '@app/shared/services/photo.service';
import { DockStateService } from '@features/dock/services/dock-state.service';

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
  protected dockState = inject(DockStateService);

  images = signal<any[]>([]);
  responsiveOptions = signal<any[]>([
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ]);

  ngOnInit() {
    this.photoService.getImages().then((data) => {
      this.images.set(data);
    });
  }
}

