import { Routes } from '@angular/router';
import { GitRepositoryManagerComponent } from './git-repository-manager.component';

export const GIT_ROUTES: Routes = [
  {
    path: '',
    component: GitRepositoryManagerComponent,
    title: 'CodeBridge - Git Management'
  }
];
