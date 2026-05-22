import { Routes } from '@angular/router';

export const SCHOOLS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./schools.component').then((m) => m.SchoolsComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/create-school/create-school.component').then((m) => m.CreateSchoolComponent),
  },
];
