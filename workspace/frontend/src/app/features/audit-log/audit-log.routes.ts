import { Routes } from '@angular/router';
import { AuditLogViewerComponent } from './audit-log-viewer.component';

export const AUDIT_LOG_ROUTES: Routes = [
  {
    path: '',
    component: AuditLogViewerComponent,
    title: 'CodeBridge - Audit Logs'
  }
];
