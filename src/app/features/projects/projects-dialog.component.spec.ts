import { TestBed } from '@angular/core/testing';
import { ProjectsDialogComponent } from './projects-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';
import { MessageService } from 'primeng/api';

describe('ProjectsDialogComponent', () => {
  let component: ProjectsDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsDialogComponent],
      providers: [DockStateService, StorageService, MessageService]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProjectsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose all projects when filter is All', () => {
    expect(component.selectedFilter()).toBe('All');
    expect(component.filteredProjects().length).toBeGreaterThan(0);
    expect(component.filteredProjects().length).toBe(
      (component as unknown as { projects: unknown[] }).projects.length
    );
  });

  it('should filter projects by technology', () => {
    component.setFilter('Angular');
    const filtered = component.filteredProjects();
    expect(filtered.every(p => p.technologies.includes('Angular'))).toBe(true);
  });

  it('should return empty array when no project matches filter', () => {
    component.setFilter('__unknown_tech__');
    expect(component.filteredProjects().length).toBe(0);
  });

  it('should include All in available technologies', () => {
    expect(component.allTechnologies()).toContain('All');
  });

  it('should reset to All filter', () => {
    component.setFilter('Angular');
    component.setFilter('All');
    expect(component.selectedFilter()).toBe('All');
  });
});
