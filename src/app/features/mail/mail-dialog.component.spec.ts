import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { vi } from 'vitest';
import { TranslateService } from '@ngx-translate/core';
import { MailDialogComponent } from './mail-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { ErrorService } from '@app/shared/services/error.service';
import { EmailService } from '@app/shared/services/email.service';

describe('MailDialogComponent', () => {
  let component: MailDialogComponent;
  let emailServiceMock: { send: ReturnType<typeof vi.fn> };
  let errorServiceMock: { handleSuccess: ReturnType<typeof vi.fn>; handleError: ReturnType<typeof vi.fn> };

  const dockStateMock = { displayMail: signal(false) };

  const validForm = {
    name: 'Marc',
    email: 'marc@test.com',
    subject: 'Hello',
    message: 'This is a test message',
  };

  beforeEach(async () => {
    emailServiceMock = { send: vi.fn().mockResolvedValue({}) };
    errorServiceMock = { handleSuccess: vi.fn(), handleError: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [MailDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        { provide: EmailService, useValue: emailServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: TranslateService, useValue: { instant: (k: string) => k, onLangChange: EMPTY, use: vi.fn() } }
      ]
    })
      .overrideComponent(MailDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(MailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid initially', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('isSubmitting is false initially', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  it('isSubmitted is false initially', () => {
    expect(component.isSubmitted()).toBe(false);
  });

  it('nameInvalid returns false when field is untouched', () => {
    expect(component.nameInvalid).toBe(false);
  });

  it('nameInvalid returns true when name field is touched and invalid', () => {
    component.form.get('name')!.markAsTouched();
    expect(component.nameInvalid).toBe(true);
  });

  it('nameInvalid returns false when name is valid and touched', () => {
    component.form.get('name')!.setValue('Marc');
    component.form.get('name')!.markAsTouched();
    expect(component.nameInvalid).toBe(false);
  });

  it('emailInvalid returns false when field is untouched', () => {
    expect(component.emailInvalid).toBe(false);
  });

  it('emailInvalid returns true when email field is touched and invalid', () => {
    component.form.get('email')!.markAsTouched();
    expect(component.emailInvalid).toBe(true);
  });

  it('messageInvalid returns false when field is untouched', () => {
    expect(component.messageInvalid).toBe(false);
  });

  it('messageInvalid returns true when message field is touched and invalid', () => {
    component.form.get('message')!.markAsTouched();
    expect(component.messageInvalid).toBe(true);
  });

  it('submit() marks all fields as touched when form is invalid', async () => {
    await component.submit();
    expect(component.form.get('name')!.touched).toBe(true);
    expect(component.form.get('email')!.touched).toBe(true);
    expect(component.form.get('message')!.touched).toBe(true);
  });

  it('submit() does not call emailService when form is invalid', async () => {
    await component.submit();
    expect(emailServiceMock.send).not.toHaveBeenCalled();
  });

  it('submit() calls emailService.send with valid form data', async () => {
    component.form.setValue(validForm);
    await component.submit();
    expect(emailServiceMock.send).toHaveBeenCalledWith({
      from_name: 'Marc',
      from_email: 'marc@test.com',
      subject: 'Hello',
      message: 'This is a test message',
    });
  });

  it('submit() sets isSubmitted to true on success', async () => {
    component.form.setValue(validForm);
    await component.submit();
    expect(component.isSubmitted()).toBe(true);
  });

  it('submit() calls errorService.handleSuccess on success', async () => {
    component.form.setValue(validForm);
    await component.submit();
    expect(errorServiceMock.handleSuccess).toHaveBeenCalled();
  });

  it('submit() resets the form on success', async () => {
    component.form.setValue(validForm);
    await component.submit();
    expect(component.form.get('name')!.value).toBeNull();
  });

  it('submit() sets isSubmitting back to false after success', async () => {
    component.form.setValue(validForm);
    await component.submit();
    expect(component.isSubmitting()).toBe(false);
  });

  it('submit() calls errorService.handleError on failure', async () => {
    emailServiceMock.send.mockRejectedValue(new Error('network error'));
    component.form.setValue(validForm);
    await component.submit();
    expect(errorServiceMock.handleError).toHaveBeenCalled();
  });

  it('submit() sets isSubmitting back to false after error', async () => {
    emailServiceMock.send.mockRejectedValue(new Error('fail'));
    component.form.setValue(validForm);
    await component.submit();
    expect(component.isSubmitting()).toBe(false);
  });

  it('onDialogHide() resets form', () => {
    component.form.setValue(validForm);
    component.onDialogHide();
    expect(component.form.get('name')!.value).toBeNull();
  });

  it('onDialogHide() resets isSubmitted to false', () => {
    component.isSubmitted.set(true);
    component.onDialogHide();
    expect(component.isSubmitted()).toBe(false);
  });
});
