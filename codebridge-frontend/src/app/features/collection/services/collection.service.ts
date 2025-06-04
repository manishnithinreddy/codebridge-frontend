import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Collection, CollectionRequest, CollectionResponse, CollectionTest } from '../models/collection.model';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  /**
   * Get the API URL for collections
   * @param projectId The project ID
   * @returns The API URL for collections
   */
  private getCollectionsUrl(projectId: string): string {
    return `${this.apiBaseUrl}/api/projects/${projectId}/collections`;
  }

  /**
   * Get all collections for a project
   * @param projectId The project ID
   * @returns Observable of collections array
   */
  getCollections(projectId: string): Observable<CollectionResponse[]> {
    return this.http.get<CollectionResponse[]>(this.getCollectionsUrl(projectId)).pipe(
      catchError(this.errorHandlingService.handleError('getCollections'))
    );
  }

  /**
   * Get a collection by ID
   * @param projectId The project ID
   * @param id The collection ID
   * @returns Observable of the collection
   */
  getCollection(projectId: string, id: string): Observable<CollectionResponse> {
    return this.http.get<CollectionResponse>(`${this.getCollectionsUrl(projectId)}/${id}`).pipe(
      catchError(this.errorHandlingService.handleError('getCollection'))
    );
  }

  /**
   * Create a new collection
   * @param projectId The project ID
   * @param collection The collection data
   * @returns Observable of the created collection
   */
  createCollection(projectId: string, collection: CollectionRequest): Observable<CollectionResponse> {
    return this.http.post<CollectionResponse>(this.getCollectionsUrl(projectId), collection).pipe(
      catchError(this.errorHandlingService.handleError('createCollection'))
    );
  }

  /**
   * Update an existing collection
   * @param projectId The project ID
   * @param id The collection ID
   * @param collection The updated collection data
   * @returns Observable of the updated collection
   */
  updateCollection(projectId: string, id: string, collection: CollectionRequest): Observable<CollectionResponse> {
    return this.http.put<CollectionResponse>(`${this.getCollectionsUrl(projectId)}/${id}`, collection).pipe(
      catchError(this.errorHandlingService.handleError('updateCollection'))
    );
  }

  /**
   * Delete a collection
   * @param projectId The project ID
   * @param id The collection ID to delete
   * @returns Observable of void
   */
  deleteCollection(projectId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.getCollectionsUrl(projectId)}/${id}`).pipe(
      catchError(this.errorHandlingService.handleError('deleteCollection'))
    );
  }

  /**
   * Run tests for a collection
   * @param projectId The project ID
   * @param id The collection ID
   * @returns Observable of the test results
   */
  runCollectionTests(projectId: string, id: string): Observable<CollectionTest> {
    return this.http.post<CollectionTest>(
      `${this.getCollectionsUrl(projectId)}/${id}/tests`, 
      {}
    ).pipe(
      catchError(this.errorHandlingService.handleError('runCollectionTests'))
    );
  }

  /**
   * Get test results for a collection
   * @param projectId The project ID
   * @param id The collection ID
   * @param testId The test ID
   * @returns Observable of the test results
   */
  getCollectionTestResults(projectId: string, id: string, testId: string): Observable<CollectionTest> {
    return this.http.get<CollectionTest>(
      `${this.getCollectionsUrl(projectId)}/${id}/tests/${testId}`
    ).pipe(
      catchError(this.errorHandlingService.handleError('getCollectionTestResults'))
    );
  }
}

