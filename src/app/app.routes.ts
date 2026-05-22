import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SCHOOLS_ROUTES } from './modules/schools/schools.routes';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./modules/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'schools',
        children: SCHOOLS_ROUTES,
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./modules/students/students.component').then((m) => m.StudentsComponent),
      },
      {
        path: 'teachers',
        loadComponent: () =>
          import('./modules/teachers/teachers.component').then((m) => m.TeachersComponent),
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('./modules/subjects/subjects.component').then((m) => m.SubjectsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./modules/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
];
