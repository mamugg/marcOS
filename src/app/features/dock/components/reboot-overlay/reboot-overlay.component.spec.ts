import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { signal } from '@angular/core';
import { RebootOverlayComponent } from './reboot-overlay.component';
import { DockStateService } from '@features/dock/services/dock-state.service';

const STUB_TEMPLATE = `
  @if (dockState.rebooting()) {
    <div class="reboot-overlay"></div>
  }
`;

describe('RebootOverlayComponent', () => {
  let fixture: ComponentFixture<RebootOverlayComponent>;
  let component: RebootOverlayComponent;
  let mockDockState: { rebooting: ReturnType<typeof signal<boolean>> };
  let reloadMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.useFakeTimers();
    sessionStorage.removeItem('marcOS_skipSplash');

    reloadMock = vi.fn();
    vi.stubGlobal('location', { reload: reloadMock });

    mockDockState = { rebooting: signal(false) };

    await TestBed.configureTestingModule({
      imports: [RebootOverlayComponent],
      providers: [{ provide: DockStateService, useValue: mockDockState }],
    })
      .overrideComponent(RebootOverlayComponent, {
        set: { template: STUB_TEMPLATE, imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RebootOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    sessionStorage.removeItem('marcOS_skipSplash');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render the overlay when not rebooting', () => {
    const overlay = fixture.nativeElement.querySelector('.reboot-overlay');
    expect(overlay).toBeFalsy();
  });

  it('should render the overlay when rebooting', () => {
    mockDockState.rebooting.set(true);
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.reboot-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should set marcOS_skipSplash in sessionStorage before reloading', () => {
    mockDockState.rebooting.set(true);
    fixture.detectChanges();

    vi.advanceTimersByTime(3000);

    expect(sessionStorage.getItem('marcOS_skipSplash')).toBe('1');
  });

  it('should call location.reload after 3 seconds when rebooting', () => {
    mockDockState.rebooting.set(true);
    fixture.detectChanges();

    expect(reloadMock).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
