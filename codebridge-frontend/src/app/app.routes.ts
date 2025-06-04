import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { 
    path: 'projects', 
    loadChildren: () => import('./features/project/project.routes').then(m => m.PROJECT_ROUTES) 
  },
  { 
    path: 'environments', 
    loadChildren: () => import('./features/environment/environment.routes').then(m => m.ENVIRONMENT_ROUTES) 
  },
  { path: '**', redirectTo: '/projects' }
];

