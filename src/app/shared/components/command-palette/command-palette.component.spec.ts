import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { vi } from 'vitest';
import { TranslateService } from '@ngx-translate/core';
import { CommandPaletteComponent } from './command-palette.component';
import { DockStateService } from '@features/dock/services/dock-state.service';

describe('CommandPaletteComponent', () => {
  let component: CommandPaletteComponent;

  const mockDisplayCommandPalette = signal(false);
  const setCommandPaletteSpy = vi.fn((v: boolean) => mockDisplayCommandPalette.set(v));
  const toggleFinderSpy = vi.fn();
  const toggleTerminalSpy = vi.fn();
  const toggleProjectsSpy = vi.fn();
  const toggleGalleriaSpy = vi.fn();
  const toggleMailSpy = vi.fn();
  const closeAllSpy = vi.fn();

  const dockStateMock = {
    displayCommandPalette: mockDisplayCommandPalette,
    setCommandPalette: setCommandPaletteSpy,
    toggleFinder: toggleFinderSpy,
    toggleTerminal: toggleTerminalSpy,
    toggleProjects: toggleProjectsSpy,
    toggleGalleria: toggleGalleriaSpy,
    toggleMail: toggleMailSpy,
    closeAll: closeAllSpy,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockDisplayCommandPalette.set(false);

    await TestBed.configureTestingModule({
      imports: [CommandPaletteComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        {
          provide: TranslateService,
          useValue: { instant: (k: string) => k, onLangChange: EMPTY, use: vi.fn() }
        }
      ]
    })
      .overrideComponent(CommandPaletteComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(CommandPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('isOpen reflects dockState.displayCommandPalette signal', () => {
    expect(component.isOpen()).toBe(false);
    mockDisplayCommandPalette.set(true);
    expect(component.isOpen()).toBe(true);
  });

  it('open() calls setCommandPalette(true)', () => {
    const event = new Event('keydown');
    vi.spyOn(event, 'preventDefault');
    component.open(event);
    expect(setCommandPaletteSpy).toHaveBeenCalledWith(true);
  });

  it('open() calls event.preventDefault()', () => {
    const event = new Event('keydown');
    const preventSpy = vi.spyOn(event, 'preventDefault');
    component.open(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it('close() calls setCommandPalette(false)', () => {
    component.close();
    expect(setCommandPaletteSpy).toHaveBeenCalledWith(false);
  });

  it('onSearchChange() updates searchQuery signal', () => {
    component.onSearchChange('finder');
    expect(component.searchQuery()).toBe('finder');
  });

  it('onSearchChange() resets activeIndex to 0', () => {
    component.activeIndex.set(3);
    component.onSearchChange('finder');
    expect(component.activeIndex()).toBe(0);
  });

  it('filteredCommands returns all commands when search is empty', () => {
    component.onSearchChange('');
    expect(component.filteredCommands().length).toBeGreaterThan(0);
  });

  it('filteredCommands filters by label', () => {
    component.onSearchChange('finder');
    const results = component.filteredCommands();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(c => c.label.toLowerCase().includes('finder'))).toBe(true);
  });

  it('filteredCommands returns empty when no command matches', () => {
    component.onSearchChange('xyzthisdoesnotexist');
    expect(component.filteredCommands()).toHaveLength(0);
  });

  it('onArrowDown increments activeIndex when palette is open', () => {
    mockDisplayCommandPalette.set(true);
    component.activeIndex.set(0);
    const event = new Event('keydown');
    vi.spyOn(event, 'preventDefault');
    component.onArrowDown(event);
    expect(component.activeIndex()).toBe(1);
  });

  it('onArrowDown does not change index when palette is closed', () => {
    mockDisplayCommandPalette.set(false);
    component.activeIndex.set(2);
    const event = new Event('keydown');
    component.onArrowDown(event);
    expect(component.activeIndex()).toBe(2);
  });

  it('onArrowDown wraps to 0 when at last item', () => {
    mockDisplayCommandPalette.set(true);
    const last = component.filteredCommands().length - 1;
    component.activeIndex.set(last);
    const event = new Event('keydown');
    vi.spyOn(event, 'preventDefault');
    component.onArrowDown(event);
    expect(component.activeIndex()).toBe(0);
  });

  it('onArrowUp decrements activeIndex when palette is open', () => {
    mockDisplayCommandPalette.set(true);
    component.activeIndex.set(3);
    const event = new Event('keydown');
    vi.spyOn(event, 'preventDefault');
    component.onArrowUp(event);
    expect(component.activeIndex()).toBe(2);
  });

  it('onArrowUp wraps to last item when at index 0', () => {
    mockDisplayCommandPalette.set(true);
    component.activeIndex.set(0);
    const event = new Event('keydown');
    vi.spyOn(event, 'preventDefault');
    component.onArrowUp(event);
    expect(component.activeIndex()).toBe(component.filteredCommands().length - 1);
  });

  it('onArrowUp does not change index when palette is closed', () => {
    mockDisplayCommandPalette.set(false);
    component.activeIndex.set(2);
    const event = new Event('keydown');
    component.onArrowUp(event);
    expect(component.activeIndex()).toBe(2);
  });

  it('onEnter executes the active command when palette is open', () => {
    mockDisplayCommandPalette.set(true);
    component.activeIndex.set(0);
    const event = new Event('keydown');
    vi.spyOn(event, 'preventDefault');
    component.onEnter(event);
    expect(toggleFinderSpy).toHaveBeenCalled();
  });

  it('onEnter closes the palette after executing', () => {
    mockDisplayCommandPalette.set(true);
    component.activeIndex.set(0);
    const event = new Event('keydown');
    vi.spyOn(event, 'preventDefault');
    component.onEnter(event);
    expect(setCommandPaletteSpy).toHaveBeenCalledWith(false);
  });

  it('onEnter does nothing when palette is closed', () => {
    mockDisplayCommandPalette.set(false);
    const event = new Event('keydown');
    component.onEnter(event);
    expect(setCommandPaletteSpy).not.toHaveBeenCalled();
  });

  it('onEnter does nothing when no command at active index', () => {
    mockDisplayCommandPalette.set(true);
    component.onSearchChange('xyzthisdoesnotexist');
    component.activeIndex.set(0);
    const event = new Event('keydown');
    vi.spyOn(event, 'preventDefault');
    component.onEnter(event);
    expect(setCommandPaletteSpy).not.toHaveBeenCalled();
  });

  it('execute() calls the command action', () => {
    const action = vi.fn();
    component.execute({ id: 'test', label: 'Test', description: 'desc', icon: '⚡', action });
    expect(action).toHaveBeenCalled();
  });

  it('execute() closes the palette', () => {
    const action = vi.fn();
    component.execute({ id: 'test', label: 'Test', description: 'desc', icon: '⚡', action });
    expect(setCommandPaletteSpy).toHaveBeenCalledWith(false);
  });

  it('closeOnOverlay() closes when target has palette-overlay class', () => {
    const div = document.createElement('div');
    div.classList.add('palette-overlay');
    component.closeOnOverlay({ target: div } as unknown as MouseEvent);
    expect(setCommandPaletteSpy).toHaveBeenCalledWith(false);
  });

  it('closeOnOverlay() does not close when target lacks palette-overlay class', () => {
    const div = document.createElement('div');
    div.classList.add('other-class');
    component.closeOnOverlay({ target: div } as unknown as MouseEvent);
    expect(setCommandPaletteSpy).not.toHaveBeenCalled();
  });

  it('commands include finder, terminal, projects, close-all', () => {
    const ids = component.filteredCommands().map(c => c.id);
    expect(ids).toContain('finder');
    expect(ids).toContain('terminal');
    expect(ids).toContain('projects');
    expect(ids).toContain('close-all');
  });
});
