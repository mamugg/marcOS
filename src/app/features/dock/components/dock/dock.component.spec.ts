import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EMPTY } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { DockComponent } from './dock.component';
import { DockMenuService } from '@features/dock/services/dock-menu.service';

describe('DockComponent', () => {
  const mockItems: MenuItem[] = [
    { label: 'Finder' },
    { label: 'Terminal' },
    { label: 'Photos' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockComponent],
      providers: [
        { provide: DockMenuService, useValue: { getDockItems: () => mockItems } },
        { provide: TranslateService, useValue: { instant: (k: string) => k, onLangChange: EMPTY } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(DockComponent, { set: { template: '', imports: [] } })
      .compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(DockComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize dockItems from DockMenuService', () => {
    const fixture = TestBed.createComponent(DockComponent);
    expect(fixture.componentInstance.dockItems()).toEqual(mockItems);
  });

  it('should expose the correct number of dock items', () => {
    const fixture = TestBed.createComponent(DockComponent);
    expect(fixture.componentInstance.dockItems().length).toBe(3);
  });

  it('should expose dock items as a signal', () => {
    const fixture = TestBed.createComponent(DockComponent);
    const items = fixture.componentInstance.dockItems();
    expect(items[0].label).toBe('Finder');
  });
});
