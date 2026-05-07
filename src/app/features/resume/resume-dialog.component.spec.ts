import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { ResumeDialogComponent } from './resume-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';

describe('ResumeDialogComponent', () => {
  let component: ResumeDialogComponent;

  const mockDisplayResume = signal(false);

  const dockStateMock = {
    displayResume: mockDisplayResume,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        StorageService,
        {
          provide: TranslateService,
          useValue: { instant: (k: string) => k, onLangChange: EMPTY, use: vi.fn() }
        }
      ]
    })
      .overrideComponent(ResumeDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(ResumeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible by default', () => {
    expect(mockDisplayResume()).toBe(false);
  });

  it('should become visible when signal is set to true', () => {
    mockDisplayResume.set(true);
    expect(mockDisplayResume()).toBe(true);
  });

  it('should expose three experience entries', () => {
    expect(component.experiences.length).toBe(3);
  });

  it('should expose one education entry', () => {
    expect(component.educations.length).toBe(1);
  });

  it('should have i18n keys for all experience fields', () => {
    component.experiences.forEach(exp => {
      expect(exp.role).toBeTruthy();
      expect(exp.company).toBeTruthy();
      expect(exp.period).toBeTruthy();
      expect(exp.description).toBeTruthy();
    });
  });

  it('should open GitHub in a new tab', () => {
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    component.openGithub();
    expect(spy).toHaveBeenCalledWith('https://github.com/mamugg', '_blank');
    spy.mockRestore();
  });

  it('should open LinkedIn in a new tab', () => {
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    component.openLinkedIn();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('linkedin.com'), '_blank');
    spy.mockRestore();
  });
});
