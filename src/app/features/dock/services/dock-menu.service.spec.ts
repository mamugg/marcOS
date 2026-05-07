import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DockMenuService } from './dock-menu.service';
import { DockStateService } from './dock-state.service';

const EN: Record<string, string> = {
  'dock.finder':            'Finder',
  'dock.terminal':          'Terminal',
  'dock.projects':          'Projects',
  'dock.photos':            'Photos',
  'dock.mail':              'Mail',
  'dock.github':            'GitHub',
  'dock.linkedin':          'LinkedIn',
  'dock.settings':          'Settings',
  'dock.trash':             'Trash',
  'menu.about':             'About',
  'menu.file':              'File',
  'menu.file.newFinder':    'New Finder Window',
  'menu.file.closeAll':     'Close All Windows',
  'menu.view':              'View',
  'menu.view.commandPalette': 'Command Palette',
  'menu.view.preferences':  'System Preferences',
  'menu.view.reload':       'Reload',
  'menu.go':                'Go',
  'menu.go.contact':        'Contact',
  'menu.window':            'Window',
  'menu.window.closeAll':   'Close All',
  'menu.help':              'Help',
  'menu.help.shortcuts':    'Keyboard Shortcuts',
  'menu.help.navigation':   'Navigation',
  'menu.help.updates':      'Check for Updates',
  'menu.help.download':     'Download Update',
  'menu.help.verify':       'Verify Integrity',
  'menu.help.diagnostics':  'Run Diagnostics',
  'menu.quit':              'Quit',
  'toast.trash.summary':    'Trash is empty',
  'toast.quit.summary':     'Nice try 😏',
  'toast.quit.detail':      "You can't quit the OS that easily.",
};

const translateMock = { instant: (k: string) => EN[k] ?? k, onLangChange: EMPTY };

describe('DockMenuService', () => {
  let service: DockMenuService;
  let dockState: {
    toggleFinder: () => void;
    toggleTerminal: () => void;
    toggleGalleria: () => void;
    toggleProjects: () => void;
    toggleMail: () => void;
    toggleAbout: () => void;
    toggleCommandPalette: () => void;
    closeAll: () => void;
  };
  let messageAddCalls: unknown[];

  beforeEach(() => {
    dockState = {
      toggleFinder: () => {},
      toggleTerminal: () => {},
      toggleGalleria: () => {},
      toggleProjects: () => {},
      toggleMail: () => {},
      toggleAbout: () => {},
      toggleCommandPalette: () => {},
      closeAll: () => {}
    };
    messageAddCalls = [];

    TestBed.configureTestingModule({
      providers: [
        DockMenuService,
        { provide: DockStateService, useValue: dockState },
        { provide: TranslateService, useValue: translateMock },
        MessageService
      ]
    });

    service = TestBed.inject(DockMenuService);
    const messageService = TestBed.inject(MessageService);
    messageService.add = (msg: unknown) => { messageAddCalls.push(msg); };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Dock items ──────────────────────────────────────────────────────────────

  it('should return dock items containing Finder, Terminal, Photos, GitHub, Trash', () => {
    const labels = service.getDockItems().map((i) => i.label);
    expect(labels).toContain('Finder');
    expect(labels).toContain('Terminal');
    expect(labels).toContain('Photos');
    expect(labels).toContain('GitHub');
    expect(labels).toContain('Trash');
  });

  it('should call toggleFinder when Finder dock item is triggered', () => {
    let called = false;
    dockState.toggleFinder = () => { called = true; };
    const finder = service.getDockItems().find((i) => i.label === 'Finder');
    finder?.command?.({} as never);
    expect(called).toBe(true);
  });

  it('should call toggleTerminal when Terminal dock item is triggered', () => {
    let called = false;
    dockState.toggleTerminal = () => { called = true; };
    const terminal = service.getDockItems().find((i) => i.label === 'Terminal');
    terminal?.command?.({} as never);
    expect(called).toBe(true);
  });

  it('should call toggleGalleria when Photos dock item is triggered', () => {
    let called = false;
    dockState.toggleGalleria = () => { called = true; };
    const photos = service.getDockItems().find((i) => i.label === 'Photos');
    photos?.command?.({} as never);
    expect(called).toBe(true);
  });

  it('should add a toast when Trash dock item is triggered', () => {
    const trash = service.getDockItems().find((i) => i.label === 'Trash');
    trash?.command?.({} as never);
    expect(messageAddCalls.length).toBe(1);
    expect((messageAddCalls[0] as { severity: string }).severity).toBe('info');
  });

  // ── Menubar top-level labels ────────────────────────────────────────────────

  it('should return menubar items with About, File, View, Go, Window, Quit', () => {
    const labels = service.getMenubarItems().map((i) => i.label);
    expect(labels).toContain('About');
    expect(labels).toContain('File');
    expect(labels).toContain('View');
    expect(labels).toContain('Go');
    expect(labels).toContain('Window');
    expect(labels).toContain('Quit');
  });

  it('should NOT contain legacy placeholder menus (Edit, Users, Events)', () => {
    const labels = service.getMenubarItems().map((i) => i.label);
    expect(labels).not.toContain('Edit');
    expect(labels).not.toContain('Users');
    expect(labels).not.toContain('Events');
  });

  // ── About ───────────────────────────────────────────────────────────────────

  it('should call toggleAbout when About is clicked', () => {
    let called = false;
    dockState.toggleAbout = () => { called = true; };
    const about = service.getMenubarItems().find((i) => i.label === 'About');
    about?.command?.({} as never);
    expect(called).toBe(true);
  });

  it('should have About as a direct command item without sub-items', () => {
    const about = service.getMenubarItems().find((i) => i.label === 'About');
    expect(about?.command).toBeTruthy();
    expect(about?.items).toBeFalsy();
  });

  // ── File ────────────────────────────────────────────────────────────────────

  it('should have File > New Finder Window that calls toggleFinder', () => {
    let called = false;
    dockState.toggleFinder = () => { called = true; };
    const file = service.getMenubarItems().find((i) => i.label === 'File');
    const item = file?.items?.find((i) => i.label === 'New Finder Window');
    item?.command?.({} as never);
    expect(called).toBe(true);
  });

  it('should have File > Close All Windows that calls closeAll', () => {
    let called = false;
    dockState.closeAll = () => { called = true; };
    const file = service.getMenubarItems().find((i) => i.label === 'File');
    const item = file?.items?.find((i) => i.label === 'Close All Windows');
    item?.command?.({} as never);
    expect(called).toBe(true);
  });

  // ── View ────────────────────────────────────────────────────────────────────

  it('should have View > Command Palette that calls toggleCommandPalette', () => {
    let called = false;
    dockState.toggleCommandPalette = () => { called = true; };
    const view = service.getMenubarItems().find((i) => i.label === 'View');
    const item = view?.items?.find((i) => i.label === 'Command Palette');
    item?.command?.({} as never);
    expect(called).toBe(true);
  });

  // ── Go ──────────────────────────────────────────────────────────────────────

  it('should have Go with Finder, Terminal, Projects, Photos, Contact', () => {
    const go = service.getMenubarItems().find((i) => i.label === 'Go');
    const labels = go?.items?.map((i) => i.label) ?? [];
    expect(labels).toContain('Finder');
    expect(labels).toContain('Terminal');
    expect(labels).toContain('Projects');
    expect(labels).toContain('Photos');
    expect(labels).toContain('Contact');
  });

  it('should have Go > Finder that calls toggleFinder', () => {
    let called = false;
    dockState.toggleFinder = () => { called = true; };
    const go = service.getMenubarItems().find((i) => i.label === 'Go');
    const item = go?.items?.find((i) => i.label === 'Finder');
    item?.command?.({} as never);
    expect(called).toBe(true);
  });

  it('should have Go > GitHub ↗ as external link', () => {
    const go = service.getMenubarItems().find((i) => i.label === 'Go');
    const item = go?.items?.find((i) => i.label === 'GitHub ↗');
    expect(item?.url).toContain('github.com');
    expect(item?.target).toBe('_blank');
  });

  it('should have Go > LinkedIn ↗ as external link', () => {
    const go = service.getMenubarItems().find((i) => i.label === 'Go');
    const item = go?.items?.find((i) => i.label === 'LinkedIn ↗');
    expect(item?.url).toContain('linkedin.com');
    expect(item?.target).toBe('_blank');
  });

  // ── Window ──────────────────────────────────────────────────────────────────

  it('should have Window > Close All that calls closeAll', () => {
    let called = false;
    dockState.closeAll = () => { called = true; };
    const win = service.getMenubarItems().find((i) => i.label === 'Window');
    const item = win?.items?.find((i) => i.label === 'Close All');
    item?.command?.({} as never);
    expect(called).toBe(true);
  });

  // ── Help / Rick Roll ────────────────────────────────────────────────────────

  it('should bury 🎶 rick roll deep in Help > Check for Updates > Download Update > Verify Integrity > Run Diagnostics', () => {
    const help        = service.getMenubarItems().find((i) => i.label === 'Help');
    const updates     = help?.items?.find((i) => i.label === 'Check for Updates');
    const download    = updates?.items?.find((i) => i.label === 'Download Update');
    const verify      = download?.items?.find((i) => i.label === 'Verify Integrity');
    const diagnostics = verify?.items?.find((i) => i.label === 'Run Diagnostics');
    const egg         = diagnostics?.items?.find((i) => i.label === '🎶');
    expect(egg).toBeTruthy();
    expect(egg?.url).toContain('youtube.com');
    expect(egg?.target).toBe('_blank');
  });

  // ── Quit ────────────────────────────────────────────────────────────────────

  it('should show a toast when Quit is clicked', () => {
    const quit = service.getMenubarItems().find((i) => i.label === 'Quit');
    quit?.command?.({} as never);
    expect(messageAddCalls.length).toBe(1);
    expect((messageAddCalls[0] as { severity: string }).severity).toBe('warn');
  });
});
