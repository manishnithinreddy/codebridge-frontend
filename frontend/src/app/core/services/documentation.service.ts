import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Documentation, DocumentationRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService extends BaseApiService {
  protected override readonly baseUrl = '/documentation';

  /**
   * Get all documentation
   */
  getDocumentation(): Observable<Documentation[]> {
    return this.get<Documentation[]>(`${this.baseUrl}`);
  }

  /**
   * Get documentation by ID
   */
  getDocumentationById(id: string): Observable<Documentation> {
    return this.get<Documentation>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create documentation
   */
  createDocumentation(request: DocumentationRequest): Observable<Documentation> {
    return this.post<Documentation>(`${this.baseUrl}`, request);
  }

  /**
   * Update documentation
   */
  updateDocumentation(id: string, documentation: Partial<Documentation>): Observable<Documentation> {
    return this.put<Documentation>(`${this.baseUrl}/${id}`, documentation);
  }

  /**
   * Delete documentation
   */
  deleteDocumentation(id: string): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Generate documentation
   */
  generateDocumentation(projectId: string): Observable<Documentation> {
    return this.post<Documentation>(`${this.baseUrl}/generate`, { projectId });
  }
}
