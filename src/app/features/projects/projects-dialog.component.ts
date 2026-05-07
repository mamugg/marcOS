import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { Project } from '@app/shared/models';

@Component({
  selector: 'app-projects-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TagModule, ButtonModule, TranslatePipe],
  templateUrl: './projects-dialog.component.html',
  styleUrl: './projects-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsDialogComponent {
  protected dockState = inject(DockStateService);

  selectedFilter = signal<string>('all');

  readonly projects: Project[] = [
    {
      id: 'marcos',
      title: 'MarcOS',
      description: '',
      technologies: ['Angular', 'TypeScript', 'PrimeNG', 'Tailwind CSS'],
      imageUrl: '',
      githubUrl: 'https://github.com/mamugg/marcos',
      date: new Date('2024-01-01'),
      featured: true
    },
    {
      id: 'project2',
      title: 'Angular Dashboard',
      description: '',
      technologies: ['Angular', 'TypeScript', 'Chart.js', 'RxJS'],
      imageUrl: '',
      githubUrl: 'https://github.com/mamugg',
      date: new Date('2023-06-01'),
      featured: false
    },
    {
      id: 'project3',
      title: 'Node.js REST API',
      description: '',
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      imageUrl: '',
      githubUrl: 'https://github.com/mamugg',
      date: new Date('2023-01-01'),
      featured: false
    }
  ];

  readonly allTechnologies = computed(() => {
    const techs = new Set<string>(['all']);
    this.projects.forEach(p => p.technologies.forEach(t => techs.add(t)));
    return Array.from(techs);
  });

  readonly filteredProjects = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'all') return this.projects;
    return this.projects.filter(p => p.technologies.includes(filter));
  });

  setFilter(tech: string): void {
    this.selectedFilter.set(tech);
  }

  openUrl(url: string | undefined): void {
    if (url) window.open(url, '_blank');
  }
}
