import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DockWindowComponent } from './dock-window.component';
import { NotificationService } from '@app/shared/services/notification.service';

describe('DockWindowComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockWindowComponent],
      providers: [
        { provide: NotificationService, useValue: { init: vi.fn() } }
      ]
    })
      .overrideComponent(DockWindowComponent, { set: { imports: [], template: '' } })
      .compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(DockWindowComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
