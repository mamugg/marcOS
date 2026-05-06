import { TestBed } from '@angular/core/testing';
import { ContactDialogComponent } from './contact-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';
import { MessageService } from 'primeng/api';

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDialogComponent],
      providers: [DockStateService, StorageService, MessageService]
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.value).toEqual({ name: '', email: '', subject: '', message: '' });
  });

  it('should be invalid when form is empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should be valid with correct values', () => {
    component.form.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a test message with enough characters'
    });
    expect(component.form.valid).toBe(true);
  });

  it('should detect invalid email', () => {
    component.form.patchValue({ email: 'not-an-email' });
    expect(component.form.get('email')?.invalid).toBe(true);
  });

  it('should detect message too short', () => {
    component.form.patchValue({ message: 'short' });
    expect(component.form.get('message')?.invalid).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(component.isSubmitting()).toBe(false);
    expect(component.form.touched).toBe(true);
  });

  it('should reset form on dialog hide', () => {
    component.form.patchValue({ name: 'John' });
    component.onDialogHide();
    expect(component.form.value.name).toBeNull();
    expect(component.isSubmitted()).toBe(false);
  });

  it('should show name error when name is invalid and touched', () => {
    component.form.get('name')?.markAsTouched();
    expect(component.nameInvalid).toBe(true);
  });

  it('should not show name error when untouched', () => {
    expect(component.nameInvalid).toBe(false);
  });
});
