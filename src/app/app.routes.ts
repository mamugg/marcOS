import { Routes } from '@angular/router';
import { MainScreenComponent } from '@features/dock/components/main-screen/main-screen.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: MainScreenComponent,
    data: { title: 'MarcOS - Portfolio' }
  },
  {
    path: '404',
    component: NotFoundComponent,
    data: { title: 'MarcOS - 404' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
