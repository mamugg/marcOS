import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { TrashFile } from '@app/shared/models';
import { TRASH_FILES } from './trash.data';

@Component({
  selector: 'app-trash-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TranslatePipe],
  templateUrl: './trash-dialog.component.html',
  styleUrl: './trash-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrashDialogComponent {
  protected readonly dockState = inject(DockStateService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  readonly files = signal<TrashFile[]>([...TRASH_FILES]);

  /** True as long as ce_bug_que_je_comprends_pas.ts is in the list. */
  readonly hasUndeletable = computed(() =>
    this.files().some(f => f.undeletable)
  );

  /**
   * Attempt to delete a file. Undeletable files reappear immediately with a toast.
   */
  deleteFile(file: TrashFile): void {
    this.files.update(list => list.filter(f => f.name !== file.name));

    if (file.undeletable) {
      setTimeout(() => {
        this.files.update(list => [...list, file]);
        this.messageService.add({
          severity: 'warn',
          summary: this.translate.instant('trash.undeletable.summary'),
          detail: this.translate.instant('trash.undeletable.detail'),
          key: 'tc'
        });
      }, 300);
    }
  }

  /**
   * Attempt to empty the trash. Undeletable files always survive.
   */
  emptyTrash(): void {
    this.files.update(list => list.filter(f => f.undeletable));
    this.messageService.add({
      severity: 'info',
      summary: this.translate.instant('trash.empty.summary'),
      key: 'tc'
    });
  }
}
