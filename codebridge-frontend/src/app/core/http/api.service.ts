import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_BASE_URL = 'http://localhost:8080/api';

interface RequestOptionsBase {
  headers?: HttpHeaders;
  params?: HttpParams;
  responseType?: 'json' | 'arraybuffer' | 'blob' | 'text';
}

interface RequestOptionsObserveBody extends RequestOptionsBase {
  observe?: 'body';
}

interface RequestOptionsObserveResponse extends RequestOptionsBase {
  observe: 'response';
}

type ApiRequestOptions = RequestOptionsObserveBody | RequestOptionsObserveResponse;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  private formatErrors(error: any) {
    console.error('ApiService Error:', error);
    return throwError(() => error);
  }

  private getFullUrl(pathOrUrl: string): string {
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    return `${API_BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
  }

  // GET
  get<T>(pathOrUrl: string, params?: HttpParams, options?: RequestOptionsObserveBody): Observable<T>;
  get<T>(pathOrUrl: string, params?: HttpParams, options?: RequestOptionsObserveResponse): Observable<HttpResponse<T>>;
  get<T>(pathOrUrl: string, params?: HttpParams, options?: ApiRequestOptions): Observable<T | HttpResponse<T>> {
    const requestUrl = this.getFullUrl(pathOrUrl);
    return (this.http.get<T>(requestUrl, { ...options, params: params } as any) as Observable<T | HttpResponse<T>>)
      .pipe(catchError(this.formatErrors));
  }

  // POST
  post<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: RequestOptionsObserveBody): Observable<T_Res>;
  post<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: RequestOptionsObserveResponse): Observable<HttpResponse<T_Res>>;
  post<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: ApiRequestOptions): Observable<T_Res | HttpResponse<T_Res>> {
    const requestUrl = this.getFullUrl(pathOrUrl);
    return (this.http.post<T_Res>(requestUrl, body, options as any) as Observable<T_Res | HttpResponse<T_Res>>)
      .pipe(catchError(this.formatErrors));
  }

  // PUT
  put<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: RequestOptionsObserveBody): Observable<T_Res>;
  put<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: RequestOptionsObserveResponse): Observable<HttpResponse<T_Res>>;
  put<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: ApiRequestOptions): Observable<T_Res | HttpResponse<T_Res>> {
    const requestUrl = this.getFullUrl(pathOrUrl);
    return (this.http.put<T_Res>(requestUrl, body, options as any) as Observable<T_Res | HttpResponse<T_Res>>)
      .pipe(catchError(this.formatErrors));
  }

  // DELETE
  delete<T_Res>(pathOrUrl: string, options?: RequestOptionsObserveBody): Observable<T_Res>;
  delete<T_Res>(pathOrUrl: string, options?: RequestOptionsObserveResponse): Observable<HttpResponse<T_Res>>;
  delete<T_Res>(pathOrUrl: string, options?: ApiRequestOptions): Observable<T_Res | HttpResponse<T_Res>> {
    const requestUrl = this.getFullUrl(pathOrUrl);
    return (this.http.delete<T_Res>(requestUrl, options as any) as Observable<T_Res | HttpResponse<T_Res>>)
      .pipe(catchError(this.formatErrors));
  }

  // PATCH
  patch<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: RequestOptionsObserveBody): Observable<T_Res>;
  patch<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: RequestOptionsObserveResponse): Observable<HttpResponse<T_Res>>;
  patch<T_Res, T_Body = any>(pathOrUrl: string, body?: T_Body, options?: ApiRequestOptions): Observable<T_Res | HttpResponse<T_Res>> {
    const requestUrl = this.getFullUrl(pathOrUrl);
    return (this.http.patch<T_Res>(requestUrl, body, options as any) as Observable<T_Res | HttpResponse<T_Res>>)
      .pipe(catchError(this.formatErrors));
  }

  // HEAD
  head(pathOrUrl: string, options?: Omit<RequestOptionsBase, 'observe' | 'responseType'>): Observable<HttpResponse<any>> {
    return this.http.head(this.getFullUrl(pathOrUrl), { ...options, observe: 'response', responseType: 'text' })
      .pipe(catchError(this.formatErrors));
  }

  // OPTIONS
  options(pathOrUrl: string, options?: Omit<RequestOptionsBase, 'observe' | 'responseType'>): Observable<HttpResponse<any>> {
    return this.http.options(this.getFullUrl(pathOrUrl), { ...options, observe: 'response', responseType: 'text' })
      .pipe(catchError(this.formatErrors));
  }
}
