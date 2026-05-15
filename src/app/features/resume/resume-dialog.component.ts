import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { Experience, Education } from '@app/shared/models';

@Component({
  selector: 'app-resume-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TabsModule, TranslatePipe],
  templateUrl: './resume-dialog.component.html',
  styleUrl: './resume-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeDialogComponent {
  protected readonly dockState = inject(DockStateService);

  protected readonly activeTab = signal('experience');

  readonly experiences: Experience[] = [
    {
      role: 'resume.exp1.role',
      company: 'resume.exp1.company',
      period: 'resume.exp1.period',
      description: 'resume.exp1.desc'
    },
    {
      role: 'resume.exp2.role',
      company: 'resume.exp2.company',
      period: 'resume.exp2.period',
      description: 'resume.exp2.desc'
    },
    {
      role: 'resume.exp3.role',
      company: 'resume.exp3.company',
      period: 'resume.exp3.period',
      description: 'resume.exp3.desc'
    }
  ];

  readonly educations: Education[] = [
    {
      degree: 'resume.edu1.degree',
      school: 'resume.edu1.school',
      period: 'resume.edu1.period'
    }
  ];

  /** Open the GitHub profile page in a new tab. */
  openGithub(): void {
    window.open('https://github.com/mamugg', '_blank');
  }

  /** Open the LinkedIn profile in a new tab. */
  openLinkedIn(): void {
    window.open('https://linkedin.com/in/marc-antoine-muggeo', '_blank');
  }
}
