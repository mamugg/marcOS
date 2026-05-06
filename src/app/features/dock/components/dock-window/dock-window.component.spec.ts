import { TestBed } from '@angular/core/testing';
import { DockWindowComponent } from './dock-window.component';

describe('DockWindowComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockWindowComponent]
    })
      .overrideComponent(DockWindowComponent, { set: { imports: [], template: '' } })
      .compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(DockWindowComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
