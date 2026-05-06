import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MenuItem } from 'primeng/api';
import { TopbarComponent } from './topbar.component';
import { DockMenuService } from '@features/dock/services/dock-menu.service';

describe('TopbarComponent', () => {
  let fixture: ComponentFixture<TopbarComponent>;
  let component: TopbarComponent;

  const mockMenubarItems: MenuItem[] = [
    { label: 'Finder' },
    { label: 'File' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        { provide: DockMenuService, useValue: { getMenubarItems: () => mockMenubarItems } }
      ]
    })
      .overrideComponent(TopbarComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (fixture && fixture.destroy) {
      fixture.destroy();
    }
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
});
