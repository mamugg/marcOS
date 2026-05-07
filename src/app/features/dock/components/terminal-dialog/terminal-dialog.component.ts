import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TerminalModule } from 'primeng/terminal';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { TerminalService } from 'primeng/terminal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TerminalModule, TranslatePipe],
  templateUrl: './terminal-dialog.component.html',
  styleUrl: './terminal-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TerminalService]
})
export class TerminalDialogComponent {
  protected dockState = inject(DockStateService);
  private terminalService = inject(TerminalService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  constructor() {
    this.terminalService.commandHandler
      .pipe(takeUntilDestroyed())
      .subscribe(command => this.commandHandler(command));
  }

  private commandHandler(text: string): void {
    const argsIndex = text.indexOf(' ');
    const command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;
    const args = argsIndex !== -1 ? text.substring(argsIndex + 1) : '';

    let response = '';

    switch (command.toLowerCase()) {
      case 'help':
        response = `Available commands:
  help           Show available commands
  date           Show current date and time
  time           Show current time
  whoami         Show username
  pwd            Print working directory
  ls             List files
  echo [text]    Echo text
  random         Generate random number (0-100)
  clear          Clear terminal
  github         Open GitHub profile
  portfolio      Show portfolio information
  skills         List tech skills
  contact        Show contact information
  greet [name]   Greet someone
  about          Show about information`;
        break;

      case 'date':
        response = new Date().toLocaleString('fr-FR');
        break;

      case 'time':
        response = new Date().toLocaleTimeString('fr-FR');
        break;

      case 'whoami':
        response = 'marc@marcos-portfolio';
        break;

      case 'pwd':
        response = '/home/marc/Portfolio';
        break;

      case 'ls':
        response = `Documents/  Projects/  Photos/
README.md  package.json  .gitignore`;
        break;

      case 'echo':
        response = args || '(empty)';
        break;

      case 'random':
        response = String(Math.floor(Math.random() * 100));
        break;

      case 'github':
        window.open('https://github.com/mamugg');
        response = 'Opening GitHub profile...';
        break;

      case 'portfolio':
        response = `MarcOS - Interactive Portfolio v1.0
Built with Angular 21, PrimeNG & Tailwind CSS
Type 'help' for available commands`;
        break;

      case 'skills':
        response = `Frontend: Angular, React, TypeScript, Tailwind CSS, PrimeNG
Backend:  Node.js, Express, MongoDB, PostgreSQL
DevOps:   Docker, Git, CI/CD, GitHub
Design:   UI/UX, Responsive Design, Accessibility (A11y)
Tools:    VS Code, Angular CLI, Webpack, ESLint`;
        break;

      case 'contact':
        response = `Email:    muggeo.marco@gmail.com
GitHub:   https://github.com/mamugg
LinkedIn: https://www.linkedin.com/in/marc-antoine-muggeo-87b794180`;
        break;

      case 'greet':
        response = `Hello ${args || 'there'}! 👋`;
        break;

      case 'about':
        response = `Marc - Full Stack Developer
Passionate about creating beautiful and performant web applications
Specialized in Angular and modern web technologies`;
        break;

      case 'clear':
      case '':
        response = '';
        break;

      case 'sudo':
        response = 'Initiating self-destruct sequence... 💣';
        setTimeout(() => {
          this.dockState.displayTerminal.set(false);
          this.router.navigate(['/404']);
        }, 1200);
        break;

      default:
        response = `Unknown command: '${command}'. Type 'help' for available commands.`;
        break;
    }

    if (response) {
      this.terminalService.sendResponse(response);
    }
  }
}
