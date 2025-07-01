import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Base API service with common HTTP operations
 */
@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected readonly baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  /**
   * GET request
   */
  protected get<T>(
    endpoint: string, 
    params?: HttpParams | { [param: string]: string | string[] },
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      params,
      headers: this.getHeaders(headers)
    });
  }

  /**
   * POST request
   */
  protected post<T>(
    endpoint: string, 
    body: any, 
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(headers)
    });
  }

  /**
   * PUT request
   */
  protected put<T>(
    endpoint: string, 
    body: any, 
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(headers)
    });
  }

  /**
   * PATCH request
   */
  protected patch<T>(
    endpoint: string, 
    body: any, 
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(headers)
    });
  }

  /**
   * DELETE request
   */
  protected delete<T>(
    endpoint: string, 
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(headers)
    });
  }

  /**
   * Upload file
   */
  protected upload<T>(
    endpoint: string, 
    file: File, 
    additionalData?: Record<string, any>
  ): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData);
  }

  /**
   * Download file
   */
  protected download(endpoint: string, filename?: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${endpoint}`, {
      responseType: 'blob',
      headers: this.getHeaders()
    });
  }

  /**
   * Get default headers with authentication
   */
  private getHeaders(additionalHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Add authentication token if available
    const token = this.getAuthToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Merge additional headers
    if (additionalHeaders) {
      additionalHeaders.keys().forEach(key => {
        headers = headers.set(key, additionalHeaders.get(key) || '');
      });
    }

    return headers;
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Build HTTP params from object
   */
  protected buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(key, item.toString());
          });
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return httpParams;
  }

  /**
   * Handle service-specific endpoint
   */
  protected getServiceEndpoint(service: string, endpoint: string): string {
    return `/${service}${endpoint}`;
  }
}
