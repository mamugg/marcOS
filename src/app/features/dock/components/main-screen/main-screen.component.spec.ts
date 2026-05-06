import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { MainScreenComponent } from './main-screen.component';

describe('MainScreenComponent', () => {
  let component: MainScreenComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainScreenComponent],
      providers: [MessageService]
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

  it('should expose dockState with default wallpaper /wallpaper.png', () => {
    expect(component['dockState'].wallpaper()).toBe('/wallpaper.png');
  });
});
