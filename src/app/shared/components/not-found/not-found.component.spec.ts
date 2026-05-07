import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: any;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    if (fixture?.destroy) fixture.destroy();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no deletion lines', () => {
    expect(component['deletionLines']()).toEqual([]);
  });

  it('should start with showError as false', () => {
    expect(component['showError']()).toBe(false);
  });

  it('should populate deletion lines over time', () => {
    vi.useFakeTimers();
    component.ngOnInit();
    vi.advanceTimersByTime(500);
    expect(component['deletionLines']().length).toBeGreaterThan(0);
  });

  it('should show error after all lines are displayed', () => {
    vi.useFakeTimers();
    component.ngOnInit();
    vi.advanceTimersByTime(5000);
    expect(component['showError']()).toBe(true);
  });

  it('should set restoring to true when goHome is called', () => {
    vi.useFakeTimers();
    component['goHome']();
    expect(component['restoring']()).toBe(true);
    vi.useRealTimers();
  });

  it('should navigate to home after 3s when goHome is called', () => {
    vi.useFakeTimers();
    component['goHome']();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    vi.useRealTimers();
  });
});
