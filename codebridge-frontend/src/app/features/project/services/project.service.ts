import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Project, ProjectRequest, ProjectResponse } from '../models/project.model';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiBaseUrl = environment.apiBaseUrl;
  private projectsUrl = `${this.apiBaseUrl}/api/projects`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  /**
   * Get all projects
   * @returns Observable of projects array
   */
  getProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(this.projectsUrl).pipe(
      catchError(this.errorHandlingService.handleError('getProjects'))
    );
  }

  /**
   * Get a project by ID
   * @param id The project ID
   * @returns Observable of the project
   */
  getProject(id: string): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.projectsUrl}/${id}`).pipe(
      catchError(this.errorHandlingService.handleError('getProject'))
    );
  }

  /**
   * Create a new project
   * @param project The project data
   * @returns Observable of the created project
   */
  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(this.projectsUrl, project).pipe(
      catchError(this.errorHandlingService.handleError('createProject'))
    );
  }

  /**
   * Update an existing project
   * @param id The project ID
   * @param project The updated project data
   * @returns Observable of the updated project
   */
  updateProject(id: string, project: ProjectRequest): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(`${this.projectsUrl}/${id}`, project).pipe(
      catchError(this.errorHandlingService.handleError('updateProject'))
    );
  }

  /**
   * Delete a project
   * @param id The project ID to delete
   * @returns Observable of void
   */
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.projectsUrl}/${id}`).pipe(
      catchError(this.errorHandlingService.handleError('deleteProject'))
    );
  }
}

