import { BaseEntity, HealthStatus } from './common.model';

/**
 * Monitoring service models
 */

export interface MonitoringMetric extends BaseEntity {
  name: string;
  type: MetricType;
  value: number;
  unit: string;
  labels: Record<string, string>;
  timestamp: string;
  source: string;
  description?: string;
}

export type MetricType = 
  | 'counter' | 'gauge' | 'histogram' | 'summary' | 'timer';

export interface MonitoringAlert extends BaseEntity {
  name: string;
  description?: string;
  severity: AlertSeverity;
  status: AlertStatus;
  rule: AlertRule;
  triggeredAt?: string;
  resolvedAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  notifications: AlertNotification[];
  metadata?: Record<string, any>;
}

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
export type AlertStatus = 'active' | 'resolved' | 'acknowledged' | 'suppressed';

export interface AlertRule {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte';
  threshold: number;
  duration: string; // e.g., "5m", "1h"
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
}

export interface AlertNotification {
  type: NotificationType;
  destination: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
}

export type NotificationType = 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';

export interface MonitoringDashboard extends BaseEntity {
  name: string;
  description?: string;
  isPublic: boolean;
  tags: string[];
  panels: DashboardPanel[];
  variables: DashboardVariable[];
  timeRange: TimeRange;
  refreshInterval: string;
  author: string;
}

export interface DashboardPanel {
  id: string;
  title: string;
  type: PanelType;
  position: PanelPosition;
  queries: MetricQuery[];
  visualization: VisualizationConfig;
  thresholds?: Threshold[];
}

export type PanelType = 
  | 'graph' | 'stat' | 'table' | 'heatmap' | 'gauge' 
  | 'bar_gauge' | 'logs' | 'text' | 'alert_list';

export interface PanelPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MetricQuery {
  id: string;
  expression: string;
  legend?: string;
  refId: string;
  datasource?: string;
}

export interface VisualizationConfig {
  displayMode?: string;
  colorMode?: string;
  orientation?: string;
  unit?: string;
  decimals?: number;
  min?: number;
  max?: number;
  colors?: string[];
}

export interface Threshold {
  value: number;
  color: string;
  op: 'gt' | 'lt';
}

export interface DashboardVariable {
  name: string;
  type: 'query' | 'custom' | 'constant' | 'datasource';
  query?: string;
  options?: string[];
  current?: string;
  multi?: boolean;
  includeAll?: boolean;
}

export interface TimeRange {
  from: string;
  to: string;
}

export interface MonitoringTarget extends BaseEntity {
  name: string;
  type: TargetType;
  url: string;
  interval: string;
  timeout: string;
  isActive: boolean;
  labels: Record<string, string>;
  authentication?: TargetAuthentication;
  healthCheck: HealthCheckConfig;
  lastCheck?: HealthCheckResult;
}

export type TargetType = 'http' | 'tcp' | 'icmp' | 'dns' | 'ssl' | 'database' | 'custom';

export interface TargetAuthentication {
  type: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth2';
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

export interface HealthCheckConfig {
  expectedStatus?: number[];
  expectedContent?: string;
  followRedirects?: boolean;
  validateSSL?: boolean;
  customScript?: string;
}

export interface HealthCheckResult {
  timestamp: string;
  status: HealthStatus;
  responseTime: number;
  statusCode?: number;
  error?: string;
  details?: Record<string, any>;
}

export interface MonitoringIncident extends BaseEntity {
  title: string;
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  priority: IncidentPriority;
  assignedTo?: string;
  reportedBy: string;
  affectedServices: string[];
  timeline: IncidentTimelineEntry[];
  postMortem?: PostMortem;
  tags: string[];
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type IncidentPriority = 'p1' | 'p2' | 'p3' | 'p4';

export interface IncidentTimelineEntry {
  timestamp: string;
  type: 'created' | 'updated' | 'comment' | 'status_change' | 'assignment';
  author: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface PostMortem {
  summary: string;
  rootCause: string;
  timeline: string;
  impact: string;
  resolution: string;
  preventionMeasures: string[];
  actionItems: ActionItem[];
  createdBy: string;
  reviewedBy?: string;
  approvedBy?: string;
}

export interface ActionItem {
  description: string;
  assignee: string;
  dueDate?: string;
  status: 'open' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface MonitoringReport extends BaseEntity {
  name: string;
  type: ReportType;
  period: ReportPeriod;
  recipients: string[];
  schedule: ReportSchedule;
  content: ReportContent;
  lastGenerated?: string;
  nextGeneration?: string;
  isActive: boolean;
}

export type ReportType = 'sla' | 'availability' | 'performance' | 'security' | 'custom';
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface ReportSchedule {
  frequency: ReportPeriod;
  dayOfWeek?: number; // 0-6, Sunday = 0
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM format
  timezone: string;
}

export interface ReportContent {
  sections: ReportSection[];
  format: 'html' | 'pdf' | 'json';
  includeCharts: boolean;
  includeRawData: boolean;
}

export interface ReportSection {
  title: string;
  type: 'metrics' | 'alerts' | 'incidents' | 'sla' | 'custom';
  queries: string[];
  visualization?: string;
}

export interface SLADefinition extends BaseEntity {
  name: string;
  description?: string;
  service: string;
  objectives: SLAObjective[];
  period: SLAPeriod;
  isActive: boolean;
  notifications: SLANotification[];
}

export interface SLAObjective {
  name: string;
  type: 'availability' | 'latency' | 'error_rate' | 'throughput';
  target: number;
  unit: string;
  query: string;
}

export type SLAPeriod = 'rolling_30d' | 'rolling_7d' | 'monthly' | 'weekly' | 'daily';

export interface SLANotification {
  threshold: number; // percentage of SLA breach
  recipients: string[];
  channels: NotificationType[];
}

export interface SLAStatus {
  slaId: string;
  period: string;
  objectives: SLAObjectiveStatus[];
  overallStatus: 'healthy' | 'at_risk' | 'breached';
  errorBudget: ErrorBudget;
}

export interface SLAObjectiveStatus {
  name: string;
  current: number;
  target: number;
  status: 'healthy' | 'at_risk' | 'breached';
  trend: 'improving' | 'stable' | 'degrading';
}

export interface ErrorBudget {
  total: number;
  consumed: number;
  remaining: number;
  percentage: number;
  burnRate: number;
}

export interface MonitoringIntegration extends BaseEntity {
  name: string;
  type: IntegrationType;
  configuration: Record<string, any>;
  isActive: boolean;
  lastSync?: string;
  syncStatus?: 'success' | 'failed' | 'in_progress';
  errorMessage?: string;
}

export type IntegrationType = 
  | 'prometheus' | 'grafana' | 'datadog' | 'new_relic' | 'splunk'
  | 'elastic' | 'jaeger' | 'zipkin' | 'aws_cloudwatch' | 'azure_monitor'
  | 'gcp_monitoring' | 'custom';

export interface LogEntry extends BaseEntity {
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  service?: string;
  traceId?: string;
  spanId?: string;
  userId?: string;
  requestId?: string;
  fields: Record<string, any>;
}

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogQuery {
  query: string;
  timeRange: TimeRange;
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
  fields?: string[];
  filters?: LogFilter[];
}

export interface LogFilter {
  field: string;
  operator: 'eq' | 'ne' | 'contains' | 'not_contains' | 'regex';
  value: string;
}

export interface TraceSpan extends BaseEntity {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  service: string;
  startTime: string;
  duration: number;
  tags: Record<string, any>;
  logs: SpanLog[];
  status: SpanStatus;
}

export interface SpanLog {
  timestamp: string;
  fields: Record<string, any>;
}

export type SpanStatus = 'ok' | 'error' | 'timeout' | 'cancelled';

export interface Trace {
  traceId: string;
  spans: TraceSpan[];
  duration: number;
  services: string[];
  operations: string[];
  startTime: string;
  endTime: string;
  errors: number;
}
