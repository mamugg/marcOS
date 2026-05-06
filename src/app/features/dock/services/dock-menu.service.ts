import { Injectable, inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DockStateService } from './dock-state.service';

@Injectable({ providedIn: 'root' })
export class DockMenuService {
  private dockState = inject(DockStateService);
  private messageService = inject(MessageService);

  getDockItems(): MenuItem[] {
    return [
      {
        label: 'Finder',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg',
        command: () => this.dockState.toggleFinder()
      },
      {
        label: 'Terminal',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/terminal.svg',
        command: () => this.dockState.toggleTerminal()
      },
      {
        label: 'Projects',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg',
        command: () => this.dockState.toggleProjects()
      },
      {
        label: 'Photos',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg',
        command: () => this.dockState.toggleGalleria()
      },
      {
        label: 'Mail',
        icon: 'icons/mail.svg',
        command: () => this.dockState.toggleMail()
      },
      {
        label: 'GitHub',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/github.svg',
        url: 'https://github.com/mamugg',
        target: '_blank'
      },
      {
        label: 'LinkedIn',
        icon: 'icons/linkedin.svg',
        url: 'https://www.linkedin.com/in/marc-antoine-muggeo-87b794180',
        target: '_blank'
      },
      {
        label: 'Trash',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png',
        command: () => {
          this.messageService.add({ severity: 'info', summary: 'Trash is empty', key: 'tc' });
        }
      }
    ];
  }

  getMenubarItems(): MenuItem[] {
    return [
      {
        label: 'About',
        styleClass: 'menubar-root',
        command: () => this.dockState.toggleAbout()
      },
      {
        label: 'File',
        items: [
          {
            label: 'New Finder Window',
            icon: 'pi pi-fw pi-folder-open',
            command: () => this.dockState.toggleFinder()
          },
          { separator: true },
          {
            label: 'Close All Windows',
            icon: 'pi pi-fw pi-times',
            command: () => this.dockState.closeAll()
          }
        ]
      },
      {
        label: 'View',
        items: [
          {
            label: 'Command Palette',
            icon: 'pi pi-fw pi-search',
            command: () => this.dockState.toggleCommandPalette()
          },
          { separator: true },
          {
            label: 'Reload',
            icon: 'pi pi-fw pi-refresh',
            command: () => window.location.reload()
          }
        ]
      },
      {
        label: 'Go',
        items: [
          {
            label: 'Finder',
            icon: 'pi pi-fw pi-folder',
            command: () => this.dockState.toggleFinder()
          },
          {
            label: 'Terminal',
            icon: 'pi pi-fw pi-code',
            command: () => this.dockState.toggleTerminal()
          },
          {
            label: 'Projects',
            icon: 'pi pi-fw pi-briefcase',
            command: () => this.dockState.toggleProjects()
          },
          {
            label: 'Photos',
            icon: 'pi pi-fw pi-images',
            command: () => this.dockState.toggleGalleria()
          },
          {
            label: 'Contact',
            icon: 'pi pi-fw pi-envelope',
            command: () => this.dockState.toggleMail()
          },
          { separator: true },
          {
            label: 'GitHub ↗',
            icon: 'pi pi-fw pi-github',
            url: 'https://github.com/mamugg',
            target: '_blank'
          },
          {
            label: 'LinkedIn ↗',
            icon: 'pi pi-fw pi-linkedin',
            url: 'https://www.linkedin.com/in/marc-antoine-muggeo-87b794180',
            target: '_blank'
          }
        ]
      },
      {
        label: 'Window',
        items: [
          {
            label: 'Finder',
            command: () => this.dockState.toggleFinder()
          },
          {
            label: 'Terminal',
            command: () => this.dockState.toggleTerminal()
          },
          {
            label: 'Projects',
            command: () => this.dockState.toggleProjects()
          },
          {
            label: 'Photos',
            command: () => this.dockState.toggleGalleria()
          },
          {
            label: 'Contact',
            command: () => this.dockState.toggleMail()
          },
          { separator: true },
          {
            label: 'Close All',
            icon: 'pi pi-fw pi-times-circle',
            command: () => this.dockState.closeAll()
          }
        ]
      },
      {
        label: 'Quit',
        command: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Nice try 😏',
            detail: "You can't quit the OS that easily.",
            key: 'tc'
          });
        }
      }
    ];
  }
}

