import { Routes } from '@angular/router';
import { DockerDashboardComponent } from './docker-dashboard.component';

export const DOCKER_ROUTES: Routes = [
  {
    path: '',
    component: DockerDashboardComponent,
    title: 'CodeBridge - Docker Management'
  }
];
