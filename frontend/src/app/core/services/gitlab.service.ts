import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { GitlabProject, GitlabRepository, GitlabBranch } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GitlabService extends BaseApiService {
  protected override readonly baseUrl = '/gitlab';

  /**
   * Get GitLab projects
   */
  getProjects(): Observable<GitlabProject[]> {
    return this.get<GitlabProject[]>(`${this.baseUrl}/projects`);
  }

  /**
   * Get GitLab repositories
   */
  getRepositories(): Observable<GitlabRepository[]> {
    return this.get<GitlabRepository[]>(`${this.baseUrl}/repositories`);
  }

  /**
   * Get branches for a repository
   */
  getBranches(repositoryId: string): Observable<GitlabBranch[]> {
    return this.get<GitlabBranch[]>(`${this.baseUrl}/repositories/${repositoryId}/branches`);
  }

  /**
   * Clone a repository
   */
  cloneRepository(repositoryUrl: string): Observable<any> {
    return this.post<any>(`${this.baseUrl}/clone`, { repositoryUrl });
  }
}
