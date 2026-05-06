import { Component, ChangeDetectionStrategy, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TerminalModule } from 'primeng/terminal';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { TerminalService } from 'primeng/terminal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terminal-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TerminalModule],
  templateUrl: './terminal-dialog.component.html',
  styleUrl: './terminal-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TerminalService]
})
export class TerminalDialogComponent implements OnDestroy {
  protected dockState = inject(DockStateService);
  private terminalService = inject(TerminalService);
  private subscription: Subscription;

  constructor() {
    this.subscription = this.terminalService.commandHandler.subscribe((command) => this.commandHandler(command));
  }

  commandHandler(text: any) {
    const argsIndex = text.indexOf(' ');
    const command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;
    const args = argsIndex !== -1 ? text.substring(argsIndex + 1) : '';

    let response = '';

    // ANSI color codes
    const RESET = '\u001b[0m';
    const BOLD = '\u001b[1m';
    const GREEN = '\u001b[32m';
    const YELLOW = '\u001b[33m';
    const CYAN = '\u001b[36m';
    const MAGENTA = '\u001b[35m';
    const SEPARATOR = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

    switch (command.toLowerCase()) {
      case 'help':
        response = `${CYAN}${SEPARATOR}${RESET}
${BOLD}${GREEN}AVAILABLE COMMANDS${RESET}
${CYAN}${SEPARATOR}${RESET}
${YELLOW}help${RESET} .......................... Show available commands
${YELLOW}date${RESET} .......................... Show current date and time
${YELLOW}time${RESET} .......................... Show current time
${YELLOW}whoami${RESET} ........................ Show username
${YELLOW}pwd${RESET} ........................... Print working directory
${YELLOW}ls${RESET} ............................ List files
${YELLOW}echo${RESET} [text] .................... Echo text
${YELLOW}random${RESET} ........................ Generate random number (0-100)
${YELLOW}clear${RESET} ........................ Clear terminal
${YELLOW}github${RESET} ........................ Open GitHub profile
${YELLOW}portfolio${RESET} ..................... Show portfolio information
${YELLOW}skills${RESET} ........................ List tech skills
${YELLOW}contact${RESET} ....................... Show contact information
${YELLOW}greet${RESET} [name] .................. Greet someone (e.g: greet John)
${YELLOW}about${RESET} ......................... Show about information
${CYAN}${SEPARATOR}${RESET}`;
        break;

      case 'date':
        response = `${GREEN}${new Date().toLocaleString('fr-FR')}${RESET}`;
        break;

      case 'time':
        response = `${GREEN}${new Date().toLocaleTimeString('fr-FR')}${RESET}`;
        break;

      case 'whoami':
        response = `${MAGENTA}marc@marcos-portfolio${RESET}`;
        break;

      case 'pwd':
        response = `${CYAN}/home/marc/Portfolio${RESET}`;
        break;

      case 'ls':
        response = `${GREEN}Documents/${RESET}  ${GREEN}Projects/${RESET}  ${GREEN}Photos/${RESET}
${YELLOW}README.md${RESET}  ${YELLOW}package.json${RESET}  ${YELLOW}.gitignore${RESET}`;
        break;

      case 'echo':
        response = `${BOLD}${args || '(empty)'}${RESET}`;
        break;

      case 'random':
        response = `${GREEN}${Math.floor(Math.random() * 100)}${RESET}`;
        break;

      case 'github':
        window.open('https://github.com/mamugg');
        response = `${CYAN}Opening GitHub profile...${RESET}`;
        break;

      case 'portfolio':
        response = `${BOLD}${GREEN}MarcOS${RESET} - Interactive Portfolio v1.0
${CYAN}Built with${RESET} Angular 21, PrimeNG & Tailwind CSS
${YELLOW}Type 'help' for available commands${RESET}`;
        break;

      case 'skills':
        response = `${BOLD}${CYAN}Frontend:${RESET} Angular, React, TypeScript, Tailwind CSS, PrimeNG
${BOLD}${CYAN}Backend:${RESET} Node.js, Express, MongoDB, PostgreSQL
${BOLD}${CYAN}DevOps:${RESET} Docker, Git, CI/CD, GitHub
${BOLD}${CYAN}Design:${RESET} UI/UX, Responsive Design, Accessibility (A11y)
${BOLD}${CYAN}Tools:${RESET} VS Code, Angular CLI, Webpack, ESLint`;
        break;

      case 'contact':
        response = `${BOLD}${GREEN}Email:${RESET} contact@example.com
${BOLD}${GREEN}GitHub:${RESET} https://github.com/mamugg
${BOLD}${GREEN}LinkedIn:${RESET} https://linkedin.com
${BOLD}${GREEN}Twitter:${RESET} @marchandle`;
        break;

      case 'greet':
        response = `${BOLD}${MAGENTA}Hello ${args || 'there'}! 👋${RESET}`;
        break;

      case 'about':
        response = `${BOLD}${GREEN}Marc${RESET} - Full Stack Developer
${CYAN}Passionate about creating beautiful and performant web applications${RESET}
${CYAN}Specialized in Angular and modern web technologies${RESET}`;
        break;

      case 'clear':
        response = '';
        break;

      case '':
        response = '';
        break;

      default:
        response = `${BOLD}${MAGENTA}✗ Unknown command: '${command}'${RESET}
${YELLOW}Type 'help' for available commands${RESET}`;
        break;
    }

    if (response) {
      this.terminalService.sendResponse(response);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

