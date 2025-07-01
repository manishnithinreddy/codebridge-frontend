import { Routes } from '@angular/router';
import { OrganizationDashboardComponent } from './organization-dashboard.component';

export const ORGANIZATION_ROUTES: Routes = [
  {
    path: '',
    component: OrganizationDashboardComponent,
    title: 'CodeBridge - Organization Management'
  }
];
