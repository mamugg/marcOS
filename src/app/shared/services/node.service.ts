import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable()
export class NodeService {
  private getTreeNodesData(): TreeNode[] {
    return [
      {
        key: '0',
        label: 'Disque système',
        data: 'System Disk',
        icon: 'pi pi-fw pi-desktop',
        children: [
          {
            key: '0-0',
            label: 'Projets',
            data: 'Projects Folder',
            icon: 'pi pi-fw pi-folder',
            children: [
              { key: '0-0-0', label: 'marcOS',             icon: 'pi pi-fw pi-folder-open', data: 'en cours (depuis un moment)' },
              { key: '0-0-1', label: 'side-project',       icon: 'pi pi-fw pi-folder',      data: 'vide' },
              { key: '0-0-2', label: 'side-project (1)',   icon: 'pi pi-fw pi-folder',      data: 'aussi vide' },
              { key: '0-0-3', label: 'side-project (2)',   icon: 'pi pi-fw pi-folder',      data: 'ne pas ouvrir' },
              { key: '0-0-4', label: 'refacto_weekend.branch', icon: 'pi pi-fw pi-file',   data: 'ouverte il y a 14 mois' }
            ]
          },
          {
            key: '0-1',
            label: 'Documents',
            data: 'Documents Folder',
            icon: 'pi pi-fw pi-folder',
            children: [
              { key: '0-1-0', label: 'CV_Marc_FINAL.pdf',          icon: 'pi pi-fw pi-file-pdf', data: 'CV' },
              { key: '0-1-1', label: 'CV_Marc_FINAL_v2.pdf',       icon: 'pi pi-fw pi-file-pdf', data: 'CV v2' },
              { key: '0-1-2', label: 'CV_Marc_VRAIMENT_FINAL.pdf', icon: 'pi pi-fw pi-file-pdf', data: 'CV vraiment final' },
              { key: '0-1-3', label: 'truc_important.zip',         icon: 'pi pi-fw pi-file',     data: 'contenu inconnu' },
              { key: '0-1-4', label: 'objectifs_annee.md',         icon: 'pi pi-fw pi-file',     data: 'créé le 1er janv, jamais rouvert' },
              { key: '0-1-5', label: 'conditions_lues_approuvees.txt', icon: 'pi pi-fw pi-file', data: '0 bytes' }
            ]
          },
          {
            key: '0-2',
            label: 'Bureau',
            data: 'Desktop Folder',
            icon: 'pi pi-fw pi-folder',
            children: [
              { key: '0-2-0', label: 'CV.pdf',          icon: 'pi pi-fw pi-file-pdf', data: 'Resume' },
              { key: '0-2-1', label: 'Compétences.md',  icon: 'pi pi-fw pi-file',     data: 'Skills' }
            ]
          },
          {
            key: '0-3',
            label: 'Téléchargements',
            data: 'Downloads Folder',
            icon: 'pi pi-fw pi-folder',
            children: [
              {
                key: '0-3-0',
                label: 'screenshots',
                data: '2 847 fichiers',
                icon: 'pi pi-fw pi-folder',
                children: []
              },
              { key: '0-3-1', label: 'driver_imprimante_windows.exe', icon: 'pi pi-fw pi-file', data: 'système non-Windows, évidemment' },
              { key: '0-3-2', label: 'setup_FINAL.dmg',               icon: 'pi pi-fw pi-file', data: 'jamais installé' },
              { key: '0-3-3', label: 'facture_urgent.pdf',             icon: 'pi pi-fw pi-file-pdf', data: 'expirée depuis 8 mois' }
            ]
          },
          {
            key: '0-4',
            label: 'Dev',
            data: 'Dev Folder',
            icon: 'pi pi-fw pi-folder',
            children: [
              { key: '0-4-0', label: 'nouveau dossier (47)', icon: 'pi pi-fw pi-folder', data: '' },
              { key: '0-4-1', label: 'node_modules',         icon: 'pi pi-fw pi-folder', data: '847 GB' },
              { key: '0-4-2', label: 'solution_stackoverflow.js', icon: 'pi pi-fw pi-file', data: 'fonctionne, personne sait pourquoi' },
              { key: '0-4-3', label: 'git_message.txt',      icon: 'pi pi-fw pi-file',   data: 'contient uniquement "fix"' },
              { key: '0-4-4', label: '.env',                  icon: 'pi pi-fw pi-file',   data: 'ne pas commit' }
            ]
          }
        ]
      }
    ];
  }

  getFiles(): Promise<TreeNode[]> {
    return Promise.resolve(this.getTreeNodesData());
  }
}
