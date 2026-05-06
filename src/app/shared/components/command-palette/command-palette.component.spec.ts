import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommandPaletteComponent } from './command-palette.component';
import { DockStateService } from '@features/dock/services/dock-state.service';

const makeDockState = () => ({
  toggleFinder: vi.fn(),
  toggleTerminal: vi.fn(),
  toggleProjects: vi.fn(),
  toggleGalleria: vi.fn(),
  toggleMail: vi.fn(),
  setFinder: vi.fn(),
  setTerminal: vi.fn(),
  setGalleria: vi.fn(),
  setProjects: vi.fn(),
  setMail: vi.fn()
});

describe('CommandPaletteComponent', () => {
  let component: CommandPaletteComponent;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CommandPaletteComponent],
      providers: [
        { provide: DockStateService, useValue: makeDockState() },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .overrideComponent(CommandPaletteComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(CommandPaletteComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should open on open() call', () => {
    component.open(new KeyboardEvent('keydown'));
    expect(component.isOpen()).toBe(true);
  });

  it('should close on close() call', () => {
    component.open(new KeyboardEvent('keydown'));
    component.close();
    expect(component.isOpen()).toBe(false);
  });

  it('should filter commands by query', () => {
    component.onSearchChange('terminal');
    expect(component.filteredCommands().length).toBeGreaterThan(0);
    expect(component.filteredCommands()[0].label.toLowerCase()).toContain('terminal');
  });

  it('should return all commands when query is empty', () => {
    component.onSearchChange('');
    expect(component.filteredCommands().length).toBeGreaterThan(0);
  });

  it('should return no results for unknown query', () => {
    component.onSearchChange('void');
    expect(component.filteredCommands().length).toBe(0);
  });

  it('should navigate to /404 when "void" is entered with no results and Enter is pressed', () => {
    component.open(new KeyboardEvent('keydown'));
    component.onSearchChange('void');
    component.onEnter(new KeyboardEvent('keydown'));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
    expect(component.isOpen()).toBe(false);
  });

  it('should not navigate to /404 for unknown query that is not "void"', () => {
    component.open(new KeyboardEvent('keydown'));
    component.onSearchChange('xyzunknown');
    component.onEnter(new KeyboardEvent('keydown'));
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate to /404 when palette is closed', () => {
    component.onSearchChange('void');
    component.onEnter(new KeyboardEvent('keydown'));
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
