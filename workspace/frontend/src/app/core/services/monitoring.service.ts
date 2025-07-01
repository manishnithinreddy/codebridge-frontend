import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { MonitoringData, MetricsResponse, AlertRule } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService extends BaseApiService {
  protected override readonly baseUrl = '/monitoring';

  /**
   * Get monitoring data
   */
  getMonitoringData(): Observable<MonitoringData> {
    return this.get<MonitoringData>(`${this.baseUrl}/data`);
  }

  /**
   * Get metrics
   */
  getMetrics(): Observable<MetricsResponse> {
    return this.get<MetricsResponse>(`${this.baseUrl}/metrics`);
  }

  /**
   * Get system health
   */
  getSystemHealth(): Observable<any> {
    return this.get<any>(`${this.baseUrl}/health`);
  }

  /**
   * Get alert rules
   */
  getAlertRules(): Observable<AlertRule[]> {
    return this.get<AlertRule[]>(`${this.baseUrl}/alerts/rules`);
  }

  /**
   * Create alert rule
   */
  createAlertRule(rule: AlertRule): Observable<AlertRule> {
    return this.post<AlertRule>(`${this.baseUrl}/alerts/rules`, rule);
  }

  /**
   * Update alert rule
   */
  updateAlertRule(ruleId: string, rule: Partial<AlertRule>): Observable<AlertRule> {
    return this.put<AlertRule>(`${this.baseUrl}/alerts/rules/${ruleId}`, rule);
  }

  /**
   * Delete alert rule
   */
  deleteAlertRule(ruleId: string): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/alerts/rules/${ruleId}`);
  }
}
