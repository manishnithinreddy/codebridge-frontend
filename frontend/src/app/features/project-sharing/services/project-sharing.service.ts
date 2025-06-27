import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ShareGrantRequest, ShareGrantResponse } from '../models/project-sharing.model';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectSharingService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  /**
   * Get the API URL for project shares
   * @param projectId The project ID
   * @returns The API URL for project shares
   */
  private getSharesUrl(projectId: string): string {
    return `${this.apiBaseUrl}/api/projects/${projectId}/shares`;
  }

  /**
   * Create a new share grant
   * @param projectId The project ID
   * @param shareGrant The share grant data
   * @returns Observable of the created share grant
   */
  createShareGrant(projectId: string, shareGrant: ShareGrantRequest): Observable<ShareGrantResponse> {
    return this.http.post<ShareGrantResponse>(
      this.getSharesUrl(projectId), 
      shareGrant
    ).pipe(
      catchError(this.errorHandlingService.handleError('createShareGrant'))
    );
  }

  /**
   * Get all share grants for a project
   * @param projectId The project ID
   * @returns Observable of share grants array
   */
  getShareGrants(projectId: string): Observable<ShareGrantResponse[]> {
    return this.http.get<ShareGrantResponse[]>(
      this.getSharesUrl(projectId)
    ).pipe(
      catchError(this.errorHandlingService.handleError('getShareGrants'))
    );
  }

  /**
   * Update an existing share grant
   * @param projectId The project ID
   * @param shareId The share ID
   * @param shareGrant The updated share grant data
   * @returns Observable of the updated share grant
   */
  updateShareGrant(
    projectId: string, 
    shareId: string, 
    shareGrant: ShareGrantRequest
  ): Observable<ShareGrantResponse> {
    return this.http.put<ShareGrantResponse>(
      `${this.getSharesUrl(projectId)}/${shareId}`, 
      shareGrant
    ).pipe(
      catchError(this.errorHandlingService.handleError('updateShareGrant'))
    );
  }

  /**
   * Delete a share grant
   * @param projectId The project ID
   * @param shareId The share ID to delete
   * @returns Observable of void
   */
  deleteShareGrant(projectId: string, shareId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.getSharesUrl(projectId)}/${shareId}`
    ).pipe(
      catchError(this.errorHandlingService.handleError('deleteShareGrant'))
    );
  }
}

