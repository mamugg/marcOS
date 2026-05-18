import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EMPTY } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { DockComponent } from './dock.component';
import { DockMenuService } from '@features/dock/services/dock-menu.service';

describe('DockComponent', () => {
  const mockItems: MenuItem[] = [
    { label: 'Finder', icon: 'finder.svg' },
    { label: 'Terminal', icon: 'terminal.svg' },
    { label: 'Photos', icon: 'photos.svg' },
    { label: 'Settings', icon: 'settings.svg', url: undefined },
    { label: 'GitHub', icon: 'github.svg', url: 'https://github.com', target: '_blank' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockComponent],
      providers: [
        { provide: DockMenuService, useValue: { getDockItems: () => mockItems } },
        {
          provide: TranslateService,
          useValue: { instant: (k: string) => k, onLangChange: EMPTY }
        }
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
    expect(fixture.componentInstance.dockItems().length).toBe(5);
  });

  it('should expose dock items as a signal', () => {
    const fixture = TestBed.createComponent(DockComponent);
    expect(fixture.componentInstance.dockItems()[0].label).toBe('Finder');
  });

  describe('hoveredIndex', () => {
    it('should default to null', () => {
      const fixture = TestBed.createComponent(DockComponent);
      expect(fixture.componentInstance.hoveredIndex()).toBeNull();
    });

    it('should update when setHovered is called', () => {
      const fixture = TestBed.createComponent(DockComponent);
      fixture.componentInstance.setHovered(2);
      expect(fixture.componentInstance.hoveredIndex()).toBe(2);
    });

    it('should reset to null when clearHovered is called', () => {
      const fixture = TestBed.createComponent(DockComponent);
      fixture.componentInstance.setHovered(1);
      fixture.componentInstance.clearHovered();
      expect(fixture.componentInstance.hoveredIndex()).toBeNull();
    });
  });

  describe('itemTransforms', () => {
    it('should return scale(1) for all items when nothing is hovered', () => {
      const fixture = TestBed.createComponent(DockComponent);
      const transforms = fixture.componentInstance.itemTransforms();
      transforms.forEach(t => expect(t).toContain('scale(1)'));
    });

    it('should scale the hovered item to 1.8', () => {
      const fixture = TestBed.createComponent(DockComponent);
      fixture.componentInstance.setHovered(1);
      const transforms = fixture.componentInstance.itemTransforms();
      expect(transforms[1]).toContain('scale(1.8)');
    });

    it('should scale items at distance 1 to 1.4', () => {
      const fixture = TestBed.createComponent(DockComponent);
      fixture.componentInstance.setHovered(2);
      const transforms = fixture.componentInstance.itemTransforms();
      expect(transforms[1]).toContain('scale(1.4)');
      expect(transforms[3]).toContain('scale(1.4)');
    });

    it('should scale items at distance 2 to 1.2', () => {
      const fixture = TestBed.createComponent(DockComponent);
      fixture.componentInstance.setHovered(2);
      const transforms = fixture.componentInstance.itemTransforms();
      expect(transforms[0]).toContain('scale(1.2)');
      expect(transforms[4]).toContain('scale(1.2)');
    });

    it('should apply scale(1) to items beyond distance 2', () => {
      const fixture = TestBed.createComponent(DockComponent);
      // Items: 0,1,2,3,4 — hover index 4, distance from 0 = 4 → scale 1
      const items: MenuItem[] = [
        { label: 'A' }, { label: 'B' }, { label: 'C' },
        { label: 'D' }, { label: 'E' }, { label: 'F' }, { label: 'G' }
      ];
      const svc = TestBed.inject(DockMenuService);
      vi.spyOn(svc, 'getDockItems').mockReturnValue(items);
      fixture.componentInstance.dockItems.set(items);
      fixture.componentInstance.setHovered(6);
      const transforms = fixture.componentInstance.itemTransforms();
      expect(transforms[0]).toContain('scale(1)');
      expect(transforms[1]).toContain('scale(1)');
      expect(transforms[2]).toContain('scale(1)');
    });

    it('should recompute when hoveredIndex changes', () => {
      const fixture = TestBed.createComponent(DockComponent);
      fixture.componentInstance.setHovered(0);
      expect(fixture.componentInstance.itemTransforms()[0]).toContain('scale(1.8)');
      fixture.componentInstance.setHovered(1);
      expect(fixture.componentInstance.itemTransforms()[0]).toContain('scale(1.4)');
      fixture.componentInstance.clearHovered();
      expect(fixture.componentInstance.itemTransforms()[0]).toContain('scale(1)');
    });
  });

  describe('executeItem', () => {
    it('should call item.command when item has no url', () => {
      const fixture = TestBed.createComponent(DockComponent);
      const commandSpy = vi.fn();
      const item: MenuItem = { label: 'Test', command: commandSpy };
      const event = new MouseEvent('click');
      fixture.componentInstance.executeItem(event, item);
      expect(commandSpy).toHaveBeenCalledWith({ originalEvent: event, item });
    });

    it('should not call item.command when item has a url', () => {
      const fixture = TestBed.createComponent(DockComponent);
      const commandSpy = vi.fn();
      const item: MenuItem = { label: 'GitHub', url: 'https://github.com', command: commandSpy };
      const event = new MouseEvent('click');
      fixture.componentInstance.executeItem(event, item);
      expect(commandSpy).not.toHaveBeenCalled();
    });

    it('should not throw when item has no command and no url', () => {
      const fixture = TestBed.createComponent(DockComponent);
      const item: MenuItem = { label: 'NoOp' };
      const event = new MouseEvent('click');
      expect(() => fixture.componentInstance.executeItem(event, item)).not.toThrow();
    });
  });
});
