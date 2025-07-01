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
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) 
  },
  {
    path: 'api-test',
    loadChildren: () => import('./features/api-test/api-test.routes').then(m => m.API_TEST_ROUTES)
  },
  {
    path: 'docker',
    loadChildren: () => import('./features/docker/docker.routes').then(m => m.DOCKER_ROUTES)
  },
  {
    path: 'git',
    loadChildren: () => import('./features/git/git.routes').then(m => m.GIT_ROUTES)
  },
  {
    path: 'server',
    loadChildren: () => import('./features/server/server.routes').then(m => m.SERVER_ROUTES)
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
    path: 'collections',
    loadChildren: () => import('./features/collection/collection.routes').then(m => m.COLLECTION_ROUTES)
  },
  {
    path: 'organization',
    loadChildren: () => import('./features/organization/organization.routes').then(m => m.ORGANIZATION_ROUTES)
  },
  {
    path: 'audit-logs',
    loadChildren: () => import('./features/audit-log/audit-log.routes').then(m => m.AUDIT_LOG_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
