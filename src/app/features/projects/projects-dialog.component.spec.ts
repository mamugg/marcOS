import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsDialogComponent } from './projects-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';

describe('ProjectsDialogComponent', () => {
  let component: ProjectsDialogComponent;

  const dockStateMock = {
    displayProjects: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        { provide: TranslateService, useValue: { instant: (k: string) => k, onLangChange: EMPTY, use: vi.fn() } }
      ]
    })
      .overrideComponent(ProjectsDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(ProjectsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose a non-empty projects list', () => {
    expect(component.projects.length).toBeGreaterThan(0);
  });

  it('should include MarcOS as first project', () => {
    expect(component.projects[0].id).toBe('marcos');
  });

  it('should default filter to "all"', () => {
    expect(component.selectedFilter()).toBe('all');
  });

  it('filteredProjects returns all projects when filter is "all"', () => {
    expect(component.filteredProjects().length).toBe(component.projects.length);
  });

  it('setFilter() updates selectedFilter signal', () => {
    component.setFilter('Angular');
    expect(component.selectedFilter()).toBe('Angular');
  });

  it('filteredProjects filters by technology correctly', () => {
    component.setFilter('Angular');
    const filtered = component.filteredProjects();
    expect(filtered.every(p => p.technologies.includes('Angular'))).toBe(true);
  });

  it('filteredProjects returns empty array for unknown technology', () => {
    component.setFilter('Cobol');
    expect(component.filteredProjects()).toHaveLength(0);
  });

  it('setting filter back to "all" returns all projects', () => {
    component.setFilter('Angular');
    component.setFilter('all');
    expect(component.filteredProjects().length).toBe(component.projects.length);
  });

  it('allTechnologies includes "all" as first entry', () => {
    expect(component.allTechnologies()[0]).toBe('all');
  });

  it('allTechnologies includes Angular and TypeScript', () => {
    const techs = component.allTechnologies();
    expect(techs).toContain('Angular');
    expect(techs).toContain('TypeScript');
  });

  it('openUrl() opens a new tab for a valid URL', () => {
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    component.openUrl('https://github.com/mamugg');
    expect(spy).toHaveBeenCalledWith('https://github.com/mamugg', '_blank');
    spy.mockRestore();
  });

  it('openUrl() does nothing for undefined URL', () => {
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    component.openUrl(undefined);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
