import { TestBed } from '@angular/core/testing';
import { ToastNotifierComponent } from './toast-notifier.component';

describe('ToastNotifierComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastNotifierComponent]
    })
      .overrideComponent(ToastNotifierComponent, { set: { imports: [], template: '' } })
      .compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(ToastNotifierComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
