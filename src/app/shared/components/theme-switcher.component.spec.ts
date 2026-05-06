import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, signal } from '@angular/core';
import { ThemeSwitcher } from './theme-switcher.component';
import { PrimeNG } from 'primeng/config';

describe('ThemeSwitcher', () => {
  let component: ThemeSwitcher;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitcher],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: PrimeNG, useValue: { ripple: signal(false) } }
      ]
    })
      .overrideComponent(ThemeSwitcher, { set: { template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(ThemeSwitcher);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have default themeState with preset Aura and dark mode off', () => {
    const state = component.themeState();
    expect(state.preset).toBe('Aura');
    expect(state.darkTheme).toBe(false);
    expect(state.primary).toBe('noir');
    expect(state.surface).toBe('slate');
  });

  it('should compute iconClass as pi-moon when dark mode is off', () => {
    expect(component.iconClass()).toBe('pi-moon');
  });

  it('should compute iconClass as pi-sun when dark mode is on', () => {
    component.themeState.update((s) => ({ ...s, darkTheme: true }));
    expect(component.iconClass()).toBe('pi-sun');
  });

  it('should toggle darkTheme on onThemeToggler call', () => {
    expect(component.themeState().darkTheme).toBe(false);
    component.onThemeToggler();
    expect(component.themeState().darkTheme).toBe(true);
    component.onThemeToggler();
    expect(component.themeState().darkTheme).toBe(false);
  });

  it('should expose the available presets list', () => {
    expect(component.presets).toContain('Aura');
    expect(component.presets).toContain('Lara');
    expect(component.presets).toContain('Material');
    expect(component.presets).toContain('Nora');
  });

  it('should compute selectedPreset from themeState', () => {
    expect(component.selectedPreset()).toBe('Aura');
  });

  it('should compute selectedSurfaceColor from themeState', () => {
    expect(component.selectedSurfaceColor()).toBe('slate');
  });

  it('should compute selectedPrimaryColor from themeState', () => {
    expect(component.selectedPrimaryColor()).toBe('noir');
  });

  it('should compute theme as light when dark mode is off', () => {
    expect(component.theme()).toBe('light');
  });

  it('should compute theme as dark when dark mode is on', () => {
    component.themeState.update((s) => ({ ...s, darkTheme: true }));
    expect(component.theme()).toBe('dark');
  });

  it('should update primary color in themeState via updateColors', () => {
    component.updateColors({ stopPropagation: () => {} } as any, 'primary', { name: 'blue', palette: {} });
    expect(component.themeState().primary).toBe('blue');
  });

  it('should update surface color in themeState via updateColors', () => {
    component.updateColors({ stopPropagation: () => {} } as any, 'surface', { name: 'gray', palette: {} });
    expect(component.themeState().surface).toBe('gray');
  });

  it('should include at least 10 primary color options', () => {
    expect(component.primaryColors().length).toBeGreaterThanOrEqual(10);
  });
});
