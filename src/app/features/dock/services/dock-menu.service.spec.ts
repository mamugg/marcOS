import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { DockMenuService } from './dock-menu.service';
import { DockStateService } from './dock-state.service';

describe('DockMenuService', () => {
  let service: DockMenuService;
  let dockState: { toggleFinder: () => void; toggleTerminal: () => void; toggleGalleria: () => void };
  let messageAddCalls: any[];

  beforeEach(() => {
    dockState = { toggleFinder: () => {}, toggleTerminal: () => {}, toggleGalleria: () => {} };
    messageAddCalls = [];

    TestBed.configureTestingModule({
      providers: [
        DockMenuService,
        { provide: DockStateService, useValue: dockState },
        MessageService
      ]
    });

    service = TestBed.inject(DockMenuService);
    const messageService = TestBed.inject(MessageService);
    messageService.add = (msg: any) => { messageAddCalls.push(msg); };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return dock items containing Finder, Terminal, Photos, GitHub, Trash', () => {
    const labels = service.getDockItems().map((i) => i.label);
    expect(labels).toContain('Finder');
    expect(labels).toContain('Terminal');
    expect(labels).toContain('Photos');
    expect(labels).toContain('GitHub');
    expect(labels).toContain('Trash');
  });

  it('should call toggleFinder when Finder command is triggered', () => {
    let called = false;
    dockState.toggleFinder = () => { called = true; };
    const finder = service.getDockItems().find((i) => i.label === 'Finder');
    finder?.command?.({} as any);
    expect(called).toBe(true);
  });

  it('should call toggleTerminal when Terminal command is triggered', () => {
    let called = false;
    dockState.toggleTerminal = () => { called = true; };
    const terminal = service.getDockItems().find((i) => i.label === 'Terminal');
    terminal?.command?.({} as any);
    expect(called).toBe(true);
  });

  it('should call toggleGalleria when Photos command is triggered', () => {
    let called = false;
    dockState.toggleGalleria = () => { called = true; };
    const photos = service.getDockItems().find((i) => i.label === 'Photos');
    photos?.command?.({} as any);
    expect(called).toBe(true);
  });

  it('should add a toast when Trash command is triggered', () => {
    const trash = service.getDockItems().find((i) => i.label === 'Trash');
    trash?.command?.({} as any);
    expect(messageAddCalls.length).toBe(1);
    expect(messageAddCalls[0].severity).toBe('info');
  });

  it('should return menubar items with Finder, File, Edit labels', () => {
    const labels = service.getMenubarItems().map((i) => i.label);
    expect(labels).toContain('Finder');
    expect(labels).toContain('File');
    expect(labels).toContain('Edit');
  });

  it('should return menubar items with nested sub-items under File', () => {
    const file = service.getMenubarItems().find((i) => i.label === 'File');
    expect(file?.items?.length).toBeGreaterThan(0);
  });
});
