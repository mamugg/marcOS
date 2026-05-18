import { Component, ChangeDetectionStrategy, DestroyRef, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

const LINE_INTERVAL_MS = 120;
const ERROR_DELAY_MS = 300;
const RESTORE_REDIRECT_MS = 3000;

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent implements OnInit {
  protected deletionLines = signal<string[]>([]);
  protected showError = signal(false);
  protected restoring = signal(false);

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
        const errorTimeout = setTimeout(() => this.showError.set(true), ERROR_DELAY_MS);
        this.destroyRef.onDestroy(() => clearTimeout(errorTimeout));
      }
    }, LINE_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }

  protected goHome(): void {
    this.restoring.set(true);
    sessionStorage.setItem('marcOS_skipSplash', '1');
    const redirect = setTimeout(() => this.router.navigate(['/']), RESTORE_REDIRECT_MS);
    this.destroyRef.onDestroy(() => clearTimeout(redirect));
  }
}
