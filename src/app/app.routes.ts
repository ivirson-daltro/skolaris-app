import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
];
