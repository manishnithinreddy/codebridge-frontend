import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'docker',
    children: [
      {
        path: '',
        redirectTo: 'containers',
        pathMatch: 'full'
      },
      {
        path: 'containers',
        loadComponent: () => import('./features/docker/docker-containers.component').then(m => m.DockerContainersComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'projects', 
    loadChildren: () => import('./features/project/project.routes').then(m => m.PROJECT_ROUTES) 
  },
  { 
    path: 'environments', 
    loadChildren: () => import('./features/environment/environment.routes').then(m => m.ENVIRONMENT_ROUTES) 
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
