import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  labelKey: string;
  icon: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe],
  templateUrl: './skills-dialog.component.html',
  styleUrl: './skills-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsDialogComponent {
  protected readonly dockState = inject(DockStateService);

  readonly categories: SkillCategory[] = [
    {
      labelKey: 'skills.cat.frontend',
      icon: '🖥️',
      skills: [
        { name: 'Angular 21', level: 95 },
        { name: 'TypeScript', level: 92 },
        { name: 'RxJS', level: 85 },
        { name: 'Tailwind CSS', level: 88 },
        { name: 'HTML / SCSS', level: 90 }
      ]
    },
    {
      labelKey: 'skills.cat.backend',
      icon: '⚙️',
      skills: [
        { name: 'Node.js', level: 78 },
        { name: 'Express.js', level: 75 },
        { name: 'Spring Boot', level: 65 },
        { name: 'REST APIs', level: 88 }
      ]
    },
    {
      labelKey: 'skills.cat.tools',
      icon: '🛠️',
      skills: [
        { name: 'Git / GitHub', level: 90 },
        { name: 'Docker', level: 70 },
        { name: 'Vitest / Jest', level: 82 },
        { name: 'CI/CD', level: 72 }
      ]
    }
  ];
}
