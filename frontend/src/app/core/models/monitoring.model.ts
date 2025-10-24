export interface MonitoringData {
  timestamp: Date;
  metrics: SystemMetrics;
  services: ServiceStatus[];
  alerts: Alert[];
  performance: PerformanceMetrics;
}

export interface SystemMetrics {
  cpu: MetricValue;
  memory: MetricValue;
  disk: MetricValue;
  network: NetworkMetrics;
  uptime: number;
}

export interface MetricValue {
  current: number;
  average: number;
  peak: number;
  unit: string;
  threshold?: number;
}

export interface NetworkMetrics {
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  errors: number;
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
  endpoint?: string;
  version?: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  description?: string;
  condition: string;
  threshold: number;
  severity: AlertSeverity;
  enabled: boolean;
  actions: AlertAction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'slack';
  target: string;
  enabled: boolean;
}

export interface MetricsResponse {
  timestamp: Date;
  data: Record<string, any>;
  period: string;
  aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count';
}

export interface PerformanceMetrics {
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  concurrentUsers: number;
}

export type AlertType = 'system' | 'application' | 'security' | 'performance';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

