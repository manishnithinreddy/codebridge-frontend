import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  { path: 'login', redirectTo: '/auth/login', pathMatch: 'full'},
  { path: 'api-tester', loadChildren: () => import('./features/api-test/api-test.routes').then(m => m.API_TEST_ROUTES), canActivate: [authGuard] },
  { path: 'server-management', loadChildren: () => import('./features/server/server.routes').then(m => m.SERVER_ROUTES), canActivate: [authGuard] },
  { path: 'docker-management', loadChildren: () => import('./features/docker/docker.routes').then(m => m.DOCKER_ROUTES), canActivate: [authGuard] },
  { path: 'git-management', loadChildren: () => import('./features/git/git.routes').then(m => m.GIT_ROUTES), canActivate: [authGuard] },
  { path: 'organization', loadChildren: () => import('./features/organization/organization.routes').then(m => m.ORGANIZATION_ROUTES), canActivate: [authGuard] },
  { path: 'audit-logs', loadChildren: () => import('./features/audit-log/audit-log.routes').then(m => m.AUDIT_LOG_ROUTES), canActivate: [authGuard] },
  { path: '', component: HomeComponent, title: 'CodeBridge - Home', canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent, title: 'CodeBridge - Page Not Found' }
];
