import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./modules/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
];
