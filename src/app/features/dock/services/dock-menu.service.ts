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
        label: 'Contact',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/notes.png',
        command: () => this.dockState.toggleContact()
      },
      {
        label: 'GitHub',
        icon: 'https://primefaces.org/cdn/primeng/images/dock/github.svg',
        url: 'https://github.com/mamugg',
        target: '_blank'
      },
      {
        label: 'LinkedIn',
        icon: 'pi pi-fw pi-linkedin',
        url: 'https://linkedin.com/in/marc',
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
        label: 'Finder',
        styleClass: 'menubar-root'
      },
      {
        label: 'File',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Bookmark',
                icon: 'pi pi-fw pi-bookmark'
              },
              {
                label: 'Video',
                icon: 'pi pi-fw pi-video'
              }
            ]
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash'
          },
          {
            separator: true
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'Edit',
        items: [
          {
            label: 'Left',
            icon: 'pi pi-fw pi-align-left'
          },
          {
            label: 'Right',
            icon: 'pi pi-fw pi-align-right'
          },
          {
            label: 'Center',
            icon: 'pi pi-fw pi-align-center'
          },
          {
            label: 'Justify',
            icon: 'pi pi-fw pi-align-justify'
          }
        ]
      },
      {
        label: 'Users',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus'
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Filter',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Print',
                    icon: 'pi pi-fw pi-print'
                  }
                ]
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'List'
              }
            ]
          }
        ]
      },
      {
        label: 'Events',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Save',
                icon: 'pi pi-fw pi-calendar-plus'
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          },
          {
            label: 'Archieve',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'Remove',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          }
        ]
      },
      {
        label: 'Quit'
      }
    ];
  }
}

