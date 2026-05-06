import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { ErrorService } from '@app/shared/services/error.service';

interface ContactFormShape {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  subject: FormControl<string | null>;
  message: FormControl<string | null>;
}

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

  form: FormGroup<ContactFormShape> = this.fb.group<ContactFormShape>({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', [Validators.required, Validators.minLength(10)])
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

    // Simulation d'envoi — remplacer par un appel HTTP réel (ex: Formspree, EmailJS)
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
