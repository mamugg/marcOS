import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent implements OnInit {
  protected deletionLines = signal<string[]>([]);
  protected showError = signal(false);

  private router = inject(Router);

  private readonly filesToDelete = [
    'rm: /System/Library/CoreServices/Finder.app: Permission denied',
    'rm: /System/Library/CoreServices/Dock.app: Permission denied',
    'rm: /usr/bin/sudo: Are you kidding me?',
    'rm: /Users/marc/portfolio: Wait...',
    'rm: /Users/marc/portfolio/node_modules: This is fine.',
    'Deleting node_modules... ████████████████ 100%',
    'rm: /Users/marc/portfolio/src: Actually...',
    'rm: /Users/marc/.ssh/id_rsa: Oops.',
    'rm: /Users/marc/Documents/CV.pdf: Hmm.',
    'rm: /dev/null: You cannot delete the void.',
    '',
    '💥 SYSTEM ERROR: User tried to delete everything.',
    'Redirecting to the void...',
  ];

  ngOnInit(): void {
    this.animateDeletion();
  }

  private animateDeletion(): void {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.filesToDelete.length) {
        this.deletionLines.update(lines => [...lines, this.filesToDelete[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => this.showError.set(true), 300);
      }
    }, 120);
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }
}
