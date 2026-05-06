import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { ErrorService } from '@app/shared/services/error.service';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ButtonModule
  ],
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDialogComponent {
  protected dockState = inject(DockStateService);
  private fb = inject(FormBuilder);
  private errorService = inject(ErrorService);

  isSubmitting = signal(false);
  isSubmitted = signal(false);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  get nameInvalid(): boolean {
    const c = this.form.get('name');
    return !!(c?.invalid && c?.touched);
  }

  get emailInvalid(): boolean {
    const c = this.form.get('email');
    return !!(c?.invalid && c?.touched);
  }

  get messageInvalid(): boolean {
    const c = this.form.get('message');
    return !!(c?.invalid && c?.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Simulation d'envoi (remplacer par appel API réel)
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      this.errorService.handleSuccess('Message envoyé avec succès !', 'Contact');
      this.form.reset();

      setTimeout(() => this.isSubmitted.set(false), 3000);
    }, 1200);
  }

  onDialogHide(): void {
    this.form.reset();
    this.isSubmitted.set(false);
  }
}
