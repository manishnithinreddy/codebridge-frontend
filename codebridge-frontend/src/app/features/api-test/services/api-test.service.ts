import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiTestRequest, ApiTestResponse, TestResultResponse } from '../models/api-test.model';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private apiService = inject(ApiService);
  private readonly API_PATH = '/tests'; // This will be appended to the base API URL

  /**
   * Get all API tests for the authenticated user
   */
  getAllTests(): Observable<ApiTestResponse[]> {
    return this.apiService.get<ApiTestResponse[]>(this.API_PATH);
  }

  /**
   * Get a specific API test by ID
   */
  getTestById(id: string): Observable<ApiTestResponse> {
    return this.apiService.get<ApiTestResponse>(`${this.API_PATH}/${id}`);
  }

  /**
   * Create a new API test
   */
  createTest(request: ApiTestRequest): Observable<ApiTestResponse> {
    return this.apiService.post<ApiTestResponse>(this.API_PATH, request);
  }

  /**
   * Update an existing API test
   */
  updateTest(id: string, request: ApiTestRequest): Observable<ApiTestResponse> {
    return this.apiService.put<ApiTestResponse>(`${this.API_PATH}/${id}`, request);
  }

  /**
   * Delete an API test
   */
  deleteTest(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_PATH}/${id}`);
  }

  /**
   * Execute an API test
   */
  executeTest(id: string): Observable<TestResultResponse> {
    return this.apiService.post<TestResultResponse>(`${this.API_PATH}/${id}/execute`);
  }

  /**
   * Get all test results for an API test
   */
  getTestResults(id: string): Observable<TestResultResponse[]> {
    return this.apiService.get<TestResultResponse[]>(`${this.API_PATH}/${id}/results`);
  }
}

