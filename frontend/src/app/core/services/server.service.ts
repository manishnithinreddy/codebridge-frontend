import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ServerResponse, HealthCheck } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServerService extends BaseApiService {
  protected override readonly baseUrl = '/health';

  /**
   * Get server health status
   */
  getHealth(): Observable<HealthCheck> {
    return this.get<HealthCheck>(`${this.baseUrl}`);
  }

  /**
   * Get server information
   */
  getServerInfo(): Observable<ServerResponse> {
    return this.get<ServerResponse>(`${this.baseUrl}`);
  }

  /**
   * Get server metrics
   */
  getMetrics(): Observable<any> {
    return this.get<any>(`${this.baseUrl}`);
  }
}
