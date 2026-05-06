import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { TopbarComponent } from './topbar.component';
import { DockMenuService } from '@features/dock/services/dock-menu.service';

describe('TopbarComponent', () => {
  let fixture: ComponentFixture<TopbarComponent>;
  let component: TopbarComponent;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  const mockMenubarItems: MenuItem[] = [
    { label: 'Finder' },
    { label: 'File' }
  ];

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        { provide: DockMenuService, useValue: { getMenubarItems: () => mockMenubarItems } },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .overrideComponent(TopbarComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    if (fixture?.destroy) fixture.destroy();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menubarItems from DockMenuService', () => {
    expect(component.menubarItems()).toEqual(mockMenubarItems);
  });

  it('should set currentTime after ngOnInit', () => {
    fixture.detectChanges();
    expect(component.currentTime()).toBeTruthy();
  });

  it('should format currentTime with day and time', () => {
    fixture.detectChanges();
    expect(component.currentTime().length).toBeGreaterThan(5);
  });

  it('should unsubscribe on destroy without throwing', () => {
    fixture.detectChanges();
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should not navigate before reaching 7 logo clicks', () => {
    vi.useFakeTimers();
    for (let i = 0; i < 6; i++) component.onLogoClick();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /404 after 7 logo clicks within the time window', () => {
    vi.useFakeTimers();
    for (let i = 0; i < 7; i++) component.onLogoClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
  });

  it('should reset click count after time window expires', () => {
    vi.useFakeTimers();
    for (let i = 0; i < 6; i++) component.onLogoClick();
    vi.advanceTimersByTime(3000);
    component.onLogoClick();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
