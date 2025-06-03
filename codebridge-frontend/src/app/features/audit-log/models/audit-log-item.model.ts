export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  serviceName?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING' | 'INFO';
}
