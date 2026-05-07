import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { TranslatePipe } from '@ngx-translate/core';
import { NodeService } from '@app/shared/services/node.service';
import { ErrorService } from '@app/shared/services/error.service';
import { DockStateService } from '@features/dock/services/dock-state.service';

@Component({
  selector: 'app-finder-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TreeModule, TranslatePipe],
  templateUrl: './finder-dialog.component.html',
  styleUrl: './finder-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NodeService]
})
export class FinderDialogComponent implements OnInit {
  private nodeService = inject(NodeService);
  private errorService = inject(ErrorService);
  protected dockState = inject(DockStateService);

  nodes = signal<TreeNode[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadFiles();
  }

  private loadFiles(): void {
    try {
      this.nodeService.getFiles().then((data) => {
        if (data && data.length > 0) {
          this.nodes.set(data);
          this.isLoading.set(false);
        } else {
          this.errorService.handleWarning('Aucun fichier disponible', 'Finder vide');
          this.isLoading.set(false);
        }
      }).catch((error) => {
        this.errorService.handleError(error, 'Erreur de chargement Finder');
        this.isLoading.set(false);
      });
    } catch (error) {
      this.errorService.handleError(error, 'Erreur critique Finder');
      this.isLoading.set(false);
    }
  }
}

