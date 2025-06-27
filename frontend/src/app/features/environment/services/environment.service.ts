import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Environment, EnvironmentRequest, EnvironmentResponse } from '../models/environment.model';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private apiBaseUrl = environment.apiBaseUrl;
  private environmentsUrl = `${this.apiBaseUrl}/api/environments`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  /**
   * Get all environments
   * @returns Observable of environments array
   */
  getEnvironments(): Observable<EnvironmentResponse[]> {
    return this.http.get<EnvironmentResponse[]>(this.environmentsUrl).pipe(
      catchError(this.errorHandlingService.handleError('getEnvironments'))
    );
  }

  /**
   * Get an environment by ID
   * @param id The environment ID
   * @returns Observable of the environment
   */
  getEnvironment(id: string): Observable<EnvironmentResponse> {
    return this.http.get<EnvironmentResponse>(`${this.environmentsUrl}/${id}`).pipe(
      catchError(this.errorHandlingService.handleError('getEnvironment'))
    );
  }

  /**
   * Create a new environment
   * @param environment The environment data
   * @returns Observable of the created environment
   */
  createEnvironment(environment: EnvironmentRequest): Observable<EnvironmentResponse> {
    return this.http.post<EnvironmentResponse>(this.environmentsUrl, environment).pipe(
      catchError(this.errorHandlingService.handleError('createEnvironment'))
    );
  }

  /**
   * Update an existing environment
   * @param id The environment ID
   * @param environment The updated environment data
   * @returns Observable of the updated environment
   */
  updateEnvironment(id: string, environment: EnvironmentRequest): Observable<EnvironmentResponse> {
    return this.http.put<EnvironmentResponse>(`${this.environmentsUrl}/${id}`, environment).pipe(
      catchError(this.errorHandlingService.handleError('updateEnvironment'))
    );
  }

  /**
   * Delete an environment
   * @param id The environment ID to delete
   * @returns Observable of void
   */
  deleteEnvironment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.environmentsUrl}/${id}`).pipe(
      catchError(this.errorHandlingService.handleError('deleteEnvironment'))
    );
  }

  /**
   * Set an environment as the default
   * @param id The environment ID to set as default
   * @returns Observable of the updated environment
   */
  setDefaultEnvironment(id: string): Observable<EnvironmentResponse> {
    return this.http.post<EnvironmentResponse>(`${this.environmentsUrl}/${id}/default`, {}).pipe(
      catchError(this.errorHandlingService.handleError('setDefaultEnvironment'))
    );
  }

  /**
   * Get the default environment
   * @returns Observable of the default environment
   */
  getDefaultEnvironment(): Observable<EnvironmentResponse> {
    return this.http.get<EnvironmentResponse>(`${this.environmentsUrl}/default`).pipe(
      catchError(this.errorHandlingService.handleError('getDefaultEnvironment'))
    );
  }
}

