export interface ServerResponse {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  version: string;
  uptime: number;
  lastUpdated: Date;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  services: ServiceHealth[];
  overall: boolean;
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  details?: any;
}

