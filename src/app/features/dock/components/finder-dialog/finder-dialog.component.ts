import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';
import { NodeService } from '@app/shared/services/node.service';
import { DockStateService } from '@features/dock/services/dock-state.service';

@Component({
  selector: 'app-finder-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TreeModule],
  templateUrl: './finder-dialog.component.html',
  styleUrl: './finder-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NodeService]
})
export class FinderDialogComponent implements OnInit {
  private nodeService = inject(NodeService);
  protected dockState = inject(DockStateService);

  nodes = signal<any[]>([]);

  ngOnInit() {
    this.nodeService.getFiles().then((data) => {
      this.nodes.set(data);
    });
  }
}

