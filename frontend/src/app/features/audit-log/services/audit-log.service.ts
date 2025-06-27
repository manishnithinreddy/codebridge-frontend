import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'; // Added map
import { ApiService } from '../../../core/http/api.service';
import { AuditLogItem } from '../models/audit-log-item.model';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiService = inject(ApiService);
  private auditLogServiceBasePath = '/events-service/api/audit-logs';

  private mockAuditLogs: AuditLogItem[] = [
    { id: 'log1', timestamp: new Date(Date.now() - 10000).toISOString(), userName: 'Alice Wonderland', serviceName: 'codebridge-identity-service', action: 'user_login_success', ipAddress: '192.168.1.10', status: 'SUCCESS' },
    { id: 'log2', timestamp: new Date(Date.now() - 20000).toISOString(), userName: 'Bob The Builder', serviceName: 'codebridge-api-test-service', action: 'api_test_collection_run', entityType: 'ApiTestCollection', entityId: 'col1', entityName: 'User Auth Tests', details: { testsRun: 15, testsFailed: 1 }, status: 'SUCCESS' },
    { id: 'log3', timestamp: new Date(Date.now() - 30000).toISOString(), userName: 'Alice Wonderland', serviceName: 'codebridge-server-service', action: 'server_command_executed', entityType: 'Server', entityId: 'server-alpha', entityName: 'Prod Server Alpha', details: { command: 'ls -la /var/www' }, status: 'SUCCESS' },
    { id: 'log4', timestamp: new Date(Date.now() - 40000).toISOString(), userName: 'Charlie Brown', serviceName: 'codebridge-docker-service', action: 'docker_image_pull_failed', entityType: 'DockerImage', entityName: 'nginx:nonexistenttag', details: { error: 'Tag not found' }, status: 'FAILURE' },
    { id: 'log5', timestamp: new Date(Date.now() - 50000).toISOString(), userName: 'System', serviceName: 'codebridge-gitlab-service', action: 'webhook_received', entityType: 'GitRepository', entityId: 'repo-main', entityName: 'Main Application Repo', details: { event: 'push' }, status: 'INFO' },
  ];

  constructor() { }

  getAuditLogs(filters?: any): Observable<AuditLogItem[]> {
    console.warn('AuditLogService: Using mock audit log data.');
    let logs = [...this.mockAuditLogs]; // Create a copy to sort/filter
    if (filters) {
      if (filters.userName) {
        logs = logs.filter(log => log.userName?.toLowerCase().includes(filters.userName.toLowerCase()));
      }
      if (filters.action) {
        logs = logs.filter(log => log.action.toLowerCase().includes(filters.action.toLowerCase()));
      }
      if (filters.status) {
        logs = logs.filter(log => log.status.toLowerCase().includes(filters.status.toLowerCase()));
      }
    }
    return of(logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
        .pipe(delay(450), tap(d => console.log('Mock audit logs (filtered):', d)), catchError(() => of([])));
  }
}
