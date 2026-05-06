import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DockStateService } from '@features/dock/services/dock-state.service';

interface TechEntry {
  name: string;
  version: string;
  icon: string;
}

@Component({
  selector: 'app-about-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './about-dialog.component.html',
  styleUrl: './about-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutDialogComponent {
  protected dockState = inject(DockStateService);

  readonly techStack: TechEntry[] = [
    { name: 'Angular',    version: '19',  icon: 'https://cdn.simpleicons.org/angular/DD0031' },
    { name: 'TypeScript', version: '5.7', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
    { name: 'PrimeNG',   version: '19',  icon: 'https://primefaces.org/cdn/primeng/images/primeng-logo-dark.svg' },
    { name: 'Tailwind',  version: '4',   icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
    { name: 'Vitest',    version: '3',   icon: 'https://cdn.simpleicons.org/vitest/6E9F18' }
  ];
}
