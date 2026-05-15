import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { ErrorService } from '@app/shared/services/error.service';
import { EmailService } from '@app/shared/services/email.service';

interface ContactFormShape {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  subject: FormControl<string | null>;
  message: FormControl<string | null>;
}

@Component({
  selector: 'app-mail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    TranslatePipe
  ],
  templateUrl: './mail-dialog.component.html',
  styleUrl: './mail-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailDialogComponent {
  protected readonly dockState = inject(DockStateService);
  private readonly fb = inject(FormBuilder);
  private readonly errorService = inject(ErrorService);
  private readonly translate = inject(TranslateService);
  private readonly emailService = inject(EmailService);
  private readonly destroyRef = inject(DestroyRef);

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

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { name, email, subject, message } = this.form.getRawValue();
    const mailContext = this.translate.instant('dock.mail');

    try {
      await this.emailService.send({
        from_name: name ?? '',
        from_email: email ?? '',
        subject: subject ?? '',
        message: message ?? '',
      });
      this.isSubmitted.set(true);
      this.errorService.handleSuccess(this.translate.instant('mail.success.title'), mailContext);
      this.form.reset();
      const resetTimer = setTimeout(() => this.isSubmitted.set(false), 3000);
      this.destroyRef.onDestroy(() => clearTimeout(resetTimer));
    } catch (err) {
      this.errorService.handleError(err, mailContext);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onDialogHide(): void {
    this.form.reset();
    this.isSubmitted.set(false);
  }
}
