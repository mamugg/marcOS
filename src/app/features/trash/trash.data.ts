import { TrashFile } from '@app/shared/models';

export const TRASH_FILES: TrashFile[] = [
  { name: 'todo_demain.txt',                  description: '4 ans · modifié aujourd\'hui' },
  { name: 'solution_simple.js',               description: '847 fichiers · date inconnue' },
  { name: 'temps_libre.calendar',             description: 'introuvable sur ce système' },
  { name: 'version_stable.zip',               description: 'téléchargement en cours depuis 2021' },
  { name: 'feedback_positif.txt',             description: '0 bytes' },
  { name: 'scope_initial.pdf',                description: 'illisible' },
  { name: 'code_propre_final_vrai.ts',        description: 'lui-même dans la corbeille' },
  { name: 'les_tests_quon_ecrira_apres.spec', description: 'jamais exécuté' },
  { name: 'ce_bug_que_je_comprends_pas.ts',   description: '∞', undeletable: true },
];
