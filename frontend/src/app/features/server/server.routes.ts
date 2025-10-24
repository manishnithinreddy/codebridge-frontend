import { Routes } from '@angular/router';
import { ServerDashboardComponent } from './server-dashboard.component';

export const SERVER_ROUTES: Routes = [
  {
    path: '',
    component: ServerDashboardComponent,
    title: 'CodeBridge - Server Dashboard'
  }
];
