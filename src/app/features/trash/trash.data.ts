import { TrashFile } from '@app/shared/models';

export const TRASH_FILES: TrashFile[] = [
  { name: 'todo_demain.txt',                  size: '4 ans',       date: "Modifié aujourd'hui" },
  { name: 'solution_simple.js',               size: '847 fichiers', date: 'Inconnue' },
  { name: 'temps_libre.calendar',             size: '—',           date: 'Introuvable sur ce système' },
  { name: 'version_stable.zip',               size: '—',           date: 'Téléchargement en cours depuis 2021' },
  { name: 'feedback_positif.txt',             size: '0 bytes',     date: '—' },
  { name: 'scope_initial.pdf',                size: '—',           date: 'Illisible' },
  { name: 'code_propre_final_vrai.ts',        size: '—',           date: 'Lui-même dans la corbeille' },
  { name: 'les_tests_quon_ecrira_apres.spec', size: '—',           date: 'Jamais exécuté' },
  { name: 'ce_bug_que_je_comprends_pas.ts',   size: '∞',           date: '—', undeletable: true },
];
