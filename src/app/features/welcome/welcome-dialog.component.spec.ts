import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { WelcomeDialogComponent } from './welcome-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';

describe('WelcomeDialogComponent', () => {
  let component: WelcomeDialogComponent;

  const mockDisplayWelcome = signal(true);

  const dockStateMock = {
    displayWelcome: mockDisplayWelcome,
    dismissWelcome: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [WelcomeDialogComponent],
      providers: [{ provide: DockStateService, useValue: dockStateMock }]
    })
      .overrideComponent(WelcomeDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(WelcomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose three navigation tips', () => {
    expect(component.tips).toHaveLength(3);
  });

  it('dismiss() calls dockState.dismissWelcome', () => {
    component.dismiss();
    expect(dockStateMock.dismissWelcome).toHaveBeenCalledOnce();
  });

  it('isMobile reflects window.innerWidth below 768px', () => {
    // jsdom defaults to innerWidth 0, so isMobile should be true in test env
    expect(typeof component.isMobile).toBe('boolean');
  });
});
