import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MainScreenComponent } from './main-screen.component';

describe('MainScreenComponent', () => {
  let component: MainScreenComponent;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [MainScreenComponent],
      providers: [
        MessageService,
        { provide: Router, useValue: mockRouter }
      ]
    })
      .overrideComponent(MainScreenComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(MainScreenComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have debugMode false by default', () => {
    expect(component.debugMode).toBe(false);
  });

  it('should have wallpaperImage set to /wallpaper.png', () => {
    expect(component.wallpaperImage).toBe('/wallpaper.png');
  });

  it('should not navigate before konami sequence is complete', () => {
    const partial = ['ArrowUp', 'ArrowUp', 'ArrowDown'];
    partial.forEach(key => component.onKeydown(new KeyboardEvent('keydown', { key })));
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /404 after full konami sequence', () => {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    konami.forEach(key => component.onKeydown(new KeyboardEvent('keydown', { key })));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
  });

  it('should reset progress on wrong key and still complete with correct sequence after', () => {
    ['ArrowUp', 'ArrowUp', 'x'].forEach(key => component.onKeydown(new KeyboardEvent('keydown', { key })));
    expect(mockRouter.navigate).not.toHaveBeenCalled();

    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    konami.forEach(key => component.onKeydown(new KeyboardEvent('keydown', { key })));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
  });
});
