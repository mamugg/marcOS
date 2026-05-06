import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private messageService = inject(MessageService);

  handleError(error: unknown, context: string = 'Erreur'): void {
    console.error(`[${context}]`, error);
    const message = error instanceof Error ? error.message : 'Une erreur est survenue';
    this.messageService.add({ severity: 'error', summary: context, detail: message, life: 5000, key: 'tc' });
  }

  handleSuccess(message: string, summary: string = 'Succès'): void {
    this.messageService.add({ severity: 'success', summary, detail: message, life: 3000, key: 'tc' });
  }

  handleWarning(message: string, summary: string = 'Attention'): void {
    this.messageService.add({ severity: 'warn', summary, detail: message, life: 4000, key: 'tc' });
  }

  handleInfo(message: string, summary: string = 'Information'): void {
    this.messageService.add({ severity: 'info', summary, detail: message, life: 3000, key: 'tc' });
  }
}
