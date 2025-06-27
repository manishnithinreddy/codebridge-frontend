import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// API base URL pointing to the Gateway Service (port 8080)
// All requests will be routed through the gateway to appropriate services
const API_BASE_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  /**
   * Perform a GET request
   */
  get<T>(url: string, params?: HttpParams, options?: any): Observable<T> {
    const fullUrl = this.getFullUrl(url);
    const requestOptions = this.createRequestOptions(options, params);
    
    return this.http.get<T>(fullUrl, requestOptions) as Observable<T>;
  }

  /**
   * Perform a POST request
   */
  post<T>(url: string, body: any, options?: any): Observable<T> {
    const fullUrl = this.getFullUrl(url);
    const requestOptions = this.createRequestOptions(options);
    
    return this.http.post<T>(fullUrl, body, requestOptions) as Observable<T>;
  }

  /**
   * Perform a PUT request
   */
  put<T>(url: string, body: any, options?: any): Observable<T> {
    const fullUrl = this.getFullUrl(url);
    const requestOptions = this.createRequestOptions(options);
    
    return this.http.put<T>(fullUrl, body, requestOptions) as Observable<T>;
  }

  /**
   * Perform a DELETE request
   */
  delete<T>(url: string, options?: any): Observable<T> {
    const fullUrl = this.getFullUrl(url);
    const requestOptions = this.createRequestOptions(options);
    
    return this.http.delete<T>(fullUrl, requestOptions) as Observable<T>;
  }

  /**
   * Perform a PATCH request
   */
  patch<T>(url: string, body: any, options?: any): Observable<T> {
    const fullUrl = this.getFullUrl(url);
    const requestOptions = this.createRequestOptions(options);
    
    return this.http.patch<T>(fullUrl, body, requestOptions) as Observable<T>;
  }

  /**
   * Perform a HEAD request
   */
  head<T>(url: string, options?: any): Observable<T> {
    const fullUrl = this.getFullUrl(url);
    const requestOptions = this.createRequestOptions(options);
    
    return this.http.head<T>(fullUrl, requestOptions) as Observable<T>;
  }

  /**
   * Perform an OPTIONS request
   */
  options<T>(url: string, options?: any): Observable<T> {
    const fullUrl = this.getFullUrl(url);
    const requestOptions = this.createRequestOptions(options);
    
    return this.http.options<T>(fullUrl, requestOptions) as Observable<T>;
  }

  /**
   * Create request options by merging default options with provided options
   */
  private createRequestOptions(options?: any, params?: HttpParams): any {
    const defaultOptions: any = {
      observe: 'body',
      responseType: 'json'
    };
    
    if (params) {
      defaultOptions.params = params;
    }
    
    return options ? { ...defaultOptions, ...options } : defaultOptions;
  }

  /**
   * Get the full URL by appending the base URL
   */
  private getFullUrl(url: string): string {
    // If the URL already starts with http:// or https://, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Otherwise, append it to the API base URL
    // Remove leading slash if present to avoid double slashes
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_BASE_URL}/${cleanUrl}`;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
