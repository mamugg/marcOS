import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
  private readonly nodeService = inject(NodeService);
  private readonly errorService = inject(ErrorService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  protected readonly dockState = inject(DockStateService);

  nodes = signal<TreeNode[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    void this.loadFiles();
  }

  onNodeSelect(node: TreeNode): void {
    if (node.data === '__virus__') {
      void this.router.navigate(['/not-found']);
    }
  }

  private async loadFiles(): Promise<void> {
    try {
      const data = await this.nodeService.getFiles();
      if (data.length > 0) {
        this.nodes.set(data);
      } else {
        this.errorService.handleWarning(
          this.translate.instant('finder.error.empty'),
          this.translate.instant('finder.error.emptyTitle')
        );
      }
    } catch (error) {
      this.errorService.handleError(error, this.translate.instant('finder.error.load'));
    } finally {
      this.isLoading.set(false);
    }
  }
}

