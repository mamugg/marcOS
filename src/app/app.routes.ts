import { Routes } from '@angular/router';
import { MainScreenComponent } from '@features/dock/components/main-screen/main-screen.component';

export const routes: Routes = [
  {
    path: '',
    component: MainScreenComponent,
    data: { title: 'MarcOS - Portfolio' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
