import { Injectable, inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { DockStateService } from './dock-state.service';

@Injectable({ providedIn: 'root' })
export class DockMenuService {
  private dockState = inject(DockStateService);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  private t(key: string): string {
    return this.translate.instant(key);
  }

  getDockItems(): MenuItem[] {
    return [
      {
        label: this.t('dock.finder'),
        icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg',
        command: () => this.dockState.toggleFinder()
      },
      {
        label: this.t('dock.terminal'),
        icon: 'https://primefaces.org/cdn/primeng/images/dock/terminal.svg',
        command: () => this.dockState.toggleTerminal()
      },
      {
        label: this.t('dock.projects'),
        icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg',
        command: () => this.dockState.toggleProjects()
      },
      {
        label: this.t('dock.photos'),
        icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg',
        command: () => this.dockState.toggleGalleria()
      },
      {
        label: this.t('dock.mail'),
        icon: 'icons/mail.svg',
        command: () => this.dockState.toggleMail()
      },
      {
        label: this.t('dock.github'),
        icon: 'https://primefaces.org/cdn/primeng/images/dock/github.svg',
        url: 'https://github.com/mamugg',
        target: '_blank'
      },
      {
        label: this.t('dock.linkedin'),
        icon: 'icons/linkedin.svg',
        url: 'https://www.linkedin.com/in/marc-antoine-muggeo-87b794180',
        target: '_blank'
      },
      {
        label: this.t('dock.settings'),
        icon: 'https://primefaces.org/cdn/primeng/images/dock/settings.png',
        data: { scale: 1.2 },
        command: () => this.dockState.toggleSettings()
      },
      {
        label: this.t('dock.trash'),
        icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png',
        command: () => {
          this.messageService.add({
            severity: 'info',
            summary: this.t('toast.trash.summary'),
            key: 'tc'
          });
        }
      }
    ];
  }

  getMenubarItems(): MenuItem[] {
    return [
      {
        label: this.t('menu.about'),
        styleClass: 'menubar-root',
        command: () => this.dockState.toggleAbout()
      },
      {
        label: this.t('menu.file'),
        items: [
          {
            label: this.t('menu.file.newFinder'),
            icon: 'pi pi-fw pi-folder-open',
            command: () => this.dockState.toggleFinder()
          },
          { separator: true },
          {
            label: this.t('menu.file.closeAll'),
            icon: 'pi pi-fw pi-times',
            command: () => this.dockState.closeAll()
          }
        ]
      },
      {
        label: this.t('menu.view'),
        items: [
          {
            label: this.t('menu.view.commandPalette'),
            icon: 'pi pi-fw pi-search',
            command: () => this.dockState.toggleCommandPalette()
          },
          {
            label: this.t('menu.view.preferences'),
            icon: 'pi pi-fw pi-cog',
            command: () => this.dockState.toggleSettings()
          },
          { separator: true },
          {
            label: this.t('menu.view.reload'),
            icon: 'pi pi-fw pi-refresh',
            command: () => window.location.reload()
          }
        ]
      },
      {
        label: this.t('menu.go'),
        items: [
          {
            label: this.t('dock.finder'),
            icon: 'pi pi-fw pi-folder',
            command: () => this.dockState.toggleFinder()
          },
          {
            label: this.t('dock.terminal'),
            icon: 'pi pi-fw pi-code',
            command: () => this.dockState.toggleTerminal()
          },
          {
            label: this.t('dock.projects'),
            icon: 'pi pi-fw pi-briefcase',
            command: () => this.dockState.toggleProjects()
          },
          {
            label: this.t('dock.photos'),
            icon: 'pi pi-fw pi-images',
            command: () => this.dockState.toggleGalleria()
          },
          {
            label: this.t('menu.go.contact'),
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
        label: this.t('menu.window'),
        items: [
          {
            label: this.t('dock.finder'),
            command: () => this.dockState.toggleFinder()
          },
          {
            label: this.t('dock.terminal'),
            command: () => this.dockState.toggleTerminal()
          },
          {
            label: this.t('dock.projects'),
            command: () => this.dockState.toggleProjects()
          },
          {
            label: this.t('dock.photos'),
            command: () => this.dockState.toggleGalleria()
          },
          {
            label: this.t('menu.window.contact'),
            command: () => this.dockState.toggleMail()
          },
          {
            label: this.t('menu.window.preferences'),
            command: () => this.dockState.toggleSettings()
          },
          { separator: true },
          {
            label: this.t('menu.window.closeAll'),
            icon: 'pi pi-fw pi-times-circle',
            command: () => this.dockState.closeAll()
          }
        ]
      },
      {
        label: this.t('menu.help'),
        items: [
          {
            label: this.t('menu.help.shortcuts'),
            icon: 'pi pi-fw pi-key',
            items: [
              {
                label: this.t('menu.help.navigation'),
                icon: 'pi pi-fw pi-compass',
                items: [
                  { label: '⌘K — Command Palette' },
                  { label: '⌃T — Terminal' },
                  { label: 'ESC — Close dialog' }
                ]
              }
            ]
          },
          { separator: true },
          {
            label: this.t('menu.help.updates'),
            icon: 'pi pi-fw pi-sync',
            items: [
              {
                label: this.t('menu.help.download'),
                icon: 'pi pi-fw pi-download',
                items: [
                  {
                    label: this.t('menu.help.verify'),
                    icon: 'pi pi-fw pi-shield',
                    items: [
                      {
                        label: this.t('menu.help.diagnostics'),
                        icon: 'pi pi-fw pi-cog',
                        items: [
                          {
                            label: '🎶',
                            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                            target: '_blank'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        label: this.t('menu.quit'),
        command: () => {
          this.messageService.add({
            severity: 'warn',
            summary: this.t('toast.quit.summary'),
            detail: this.t('toast.quit.detail'),
            key: 'tc'
          });
        }
      }
    ];
  }
}
