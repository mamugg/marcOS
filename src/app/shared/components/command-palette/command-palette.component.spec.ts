import { TestBed } from '@angular/core/testing';
import { CommandPaletteComponent } from './command-palette.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';
import { MessageService } from 'primeng/api';

describe('CommandPaletteComponent', () => {
  let component: CommandPaletteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPaletteComponent],
      providers: [DockStateService, StorageService, MessageService]
    }).compileComponents();

    const fixture = TestBed.createComponent(CommandPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should close when close() is called', () => {
    component.isOpen.set(true);
    component.close();
    expect(component.isOpen()).toBe(false);
  });

  it('should show all commands when search is empty', () => {
    component.searchQuery.set('');
    expect(component.filteredCommands().length).toBeGreaterThan(0);
  });

  it('should filter commands by label', () => {
    component.searchQuery.set('terminal');
    const results = component.filteredCommands();
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(c => c.label.toLowerCase().includes('terminal') || c.description.toLowerCase().includes('terminal'))).toBe(true);
  });

  it('should filter commands by description', () => {
    component.searchQuery.set('projets');
    const results = component.filteredCommands();
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return empty when no command matches', () => {
    component.searchQuery.set('__no_match__');
    expect(component.filteredCommands().length).toBe(0);
  });

  it('should reset activeIndex when search changes', () => {
    component.activeIndex.set(3);
    component.onSearchChange('terminal');
    expect(component.activeIndex()).toBe(0);
  });

  it('should navigate down with arrow key', () => {
    component.isOpen.set(true);
    component.activeIndex.set(0);
    component.onArrowDown(new Event('keydown'));
    expect(component.activeIndex()).toBe(1);
  });

  it('should wrap around at the bottom', () => {
    component.isOpen.set(true);
    const max = component.filteredCommands().length - 1;
    component.activeIndex.set(max);
    component.onArrowDown(new Event('keydown'));
    expect(component.activeIndex()).toBe(0);
  });

  it('should navigate up with arrow key', () => {
    component.isOpen.set(true);
    component.activeIndex.set(2);
    component.onArrowUp(new Event('keydown'));
    expect(component.activeIndex()).toBe(1);
  });

  it('should wrap around at the top', () => {
    component.isOpen.set(true);
    component.activeIndex.set(0);
    component.onArrowUp(new Event('keydown'));
    expect(component.activeIndex()).toBe(component.filteredCommands().length - 1);
  });

  it('should close overlay when clicking the overlay element', () => {
    component.isOpen.set(true);
    const fakeTarget = document.createElement('div');
    fakeTarget.classList.add('palette-overlay');
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: fakeTarget });
    component.closeOnOverlay(event);
    expect(component.isOpen()).toBe(false);
  });

  it('should not close when clicking inside the palette', () => {
    component.isOpen.set(true);
    const fakeTarget = document.createElement('div');
    fakeTarget.classList.add('palette');
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: fakeTarget });
    component.closeOnOverlay(event);
    expect(component.isOpen()).toBe(true);
  });
});
