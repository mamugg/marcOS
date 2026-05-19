import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TrashDialogComponent } from './trash-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';
import { TRASH_FILES } from './trash.data';

describe('TrashDialogComponent', () => {
  let component: TrashDialogComponent;
  let messageAddCalls: unknown[];

  const mockDisplayTrash = signal(false);
  const dockStateMock = { displayTrash: mockDisplayTrash };

  const translateMock = {
    instant: (k: string) => k,
    onLangChange: EMPTY,
    use: vi.fn()
  };

  beforeEach(async () => {
    messageAddCalls = [];

    await TestBed.configureTestingModule({
      imports: [TrashDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        { provide: TranslateService, useValue: translateMock },
        { provide: MessageService, useValue: { add: (m: unknown) => messageAddCalls.push(m) } },
        StorageService
      ]
    })
      .overrideComponent(TrashDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(TrashDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible by default', () => {
    expect(mockDisplayTrash()).toBe(false);
  });

  it('should become visible when signal is set to true', () => {
    mockDisplayTrash.set(true);
    expect(mockDisplayTrash()).toBe(true);
  });

  it('should load all trash files on init', () => {
    expect(component.files().length).toBe(TRASH_FILES.length);
  });

  it('should include ce_bug_que_je_comprends_pas.ts in the file list', () => {
    const bug = component.files().find(f => f.undeletable);
    expect(bug).toBeTruthy();
    expect(bug?.name).toBe('ce_bug_que_je_comprends_pas.ts');
  });

  it('hasUndeletable should be true when undeletable file is present', () => {
    expect(component.hasUndeletable()).toBe(true);
  });

  it('should remove a deletable file when deleteFile is called', () => {
    const deletable = component.files().find(f => !f.undeletable);
    if (!deletable) throw new Error('No deletable file found');
    const before = component.files().length;
    component.deleteFile(deletable);
    expect(component.files().length).toBe(before - 1);
    expect(component.files().find(f => f.name === deletable.name)).toBeUndefined();
  });

  it('should not permanently remove undeletable file after deleteFile', () => {
    vi.useFakeTimers();
    const bug = component.files().find(f => f.undeletable)!;
    component.deleteFile(bug);
    expect(component.files().find(f => f.undeletable)).toBeUndefined();
    vi.advanceTimersByTime(400);
    expect(component.files().find(f => f.undeletable)).toBeTruthy();
    vi.useRealTimers();
  });

  it('should show a toast when deleteFile is called on undeletable file', () => {
    vi.useFakeTimers();
    const bug = component.files().find(f => f.undeletable)!;
    component.deleteFile(bug);
    vi.advanceTimersByTime(400);
    expect(messageAddCalls.length).toBeGreaterThan(0);
    vi.useRealTimers();
  });

  it('should keep only undeletable files after emptyTrash', () => {
    component.emptyTrash();
    const remaining = component.files();
    expect(remaining.every(f => f.undeletable)).toBe(true);
    expect(remaining.length).toBeGreaterThan(0);
  });

  it('should show a toast after emptyTrash', () => {
    component.emptyTrash();
    expect(messageAddCalls.length).toBe(1);
    expect((messageAddCalls[0] as { severity: string }).severity).toBe('info');
  });

  it('hasUndeletable should remain true after emptyTrash', () => {
    component.emptyTrash();
    expect(component.hasUndeletable()).toBe(true);
  });
});
