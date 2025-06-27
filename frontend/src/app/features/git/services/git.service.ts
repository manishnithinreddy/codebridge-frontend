import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/http/api.service';
import { GitRepository } from '../models/git-repository.model';
import { GitBranch } from '../models/git-branch.model';
import { GitCommit } from '../models/git-commit.model';
import { GitMergeRequest } from '../models/git-merge-request.model';

@Injectable({
  providedIn: 'root'
})
export class GitService {
  private apiService = inject(ApiService);
  private gitServiceBasePath = '/git-service/api';

  private mockRepositories: GitRepository[] = [
    { id: 'gitlab-proj-1', name: 'Frontend/Web UI', defaultBranch: 'main', httpUrl: 'https://example.com/group/frontend-ui.git', webUrl: 'https://example.com/group/frontend-ui', provider: 'GitLab', description: 'Main user interface for CodeBridge', lastActivityAt: new Date().toISOString() },
    { id: 'github-repo-2', name: 'Backend/API Gateway', defaultBranch: 'develop', httpUrl: 'https://example.com/org/api-gateway.git', webUrl: 'https://example.com/org/api-gateway', provider: 'GitHub', description: 'Handles all incoming API requests', lastActivityAt: new Date(Date.now() - 86400000*2).toISOString() },
    { id: 'gitlab-proj-3', name: 'Shared/Core Libraries', defaultBranch: 'master', httpUrl: 'https://example.com/common/core-libs.git', webUrl: 'https://example.com/common/core-libs', provider: 'GitLab', description: 'Shared utilities and libraries', lastActivityAt: new Date(Date.now() - 86400000*5).toISOString() },
  ];
  private mockData: { [repoId: string]: { branches: GitBranch[], commits: GitCommit[], mrs: GitMergeRequest[] } } = {
    'gitlab-proj-1': {
      branches: [ { name: 'main', lastCommitSha: 'abcdef12345', protected: true, webUrl: 'https://example.com/group/frontend-ui/-/tree/main' }, { name: 'feature/dark-mode', lastCommitSha: '123456abcde', webUrl: 'https://example.com/group/frontend-ui/-/tree/feature/dark-mode' } ],
      commits: [
        { sha: 'abcdef12345', shortSha: 'abcdef1', message: 'Merge branch feature/dark-mode into main', authorName: 'Dev One', authoredDate: new Date().toISOString(), webUrl: 'https://example.com/group/frontend-ui/-/commit/abcdef12345' },
        { sha: '123456abcde', shortSha: '123456a', message: 'feat: Implement dark mode toggle', authorName: 'Dev Two', authoredDate: new Date(Date.now() - 3600000).toISOString(), webUrl: 'https://example.com/group/frontend-ui/-/commit/123456abcde' }
      ],
      mrs: [ { id: 12, iid: 12, title: 'Implement Dark Mode', sourceBranch: 'feature/dark-mode', targetBranch: 'main', status: 'merged', authorUsername: 'Dev Two', createdAt: new Date(Date.now() - 7200000).toISOString(), webUrl: 'https://example.com/group/frontend-ui/-/merge_requests/12' } ]
    },
    'github-repo-2': {
      branches: [ { name: 'develop', lastCommitSha: 'fedcba98765', protected: false, webUrl: 'https://example.com/org/api-gateway/tree/develop' }, { name: 'bugfix/auth-issue', lastCommitSha: '987654fedcb', webUrl: 'https://example.com/org/api-gateway/tree/bugfix/auth-issue'} ],
      commits: [
        { sha: 'fedcba98765', shortSha: 'fedcba9', message: 'refactor: Improve authentication middleware', authorName: 'Dev Three', authoredDate: new Date(Date.now() - 86400000).toISOString(), webUrl: 'https://example.com/org/api-gateway/commit/fedcba98765' },
        { sha: '987654fedcb', shortSha: '987654f', message: 'fix: Resolve critical auth bypass', authorName: 'Dev Four', authoredDate: new Date(Date.now() - 86400000 - 3600000).toISOString(), webUrl: 'https://example.com/org/api-gateway/commit/987654fedcb' }
      ],
      mrs: [ { id: 5, title: 'Fix: Critical Authentication Bypass', sourceBranch: 'bugfix/auth-issue', targetBranch: 'develop', status: 'open', authorUsername: 'Dev Four', createdAt: new Date(Date.now() - 7200000*2).toISOString(), webUrl: 'https://example.com/org/api-gateway/pull/5' } ]
    },
     'gitlab-proj-3': {
      branches: [ { name: 'master', lastCommitSha: 'aabbcc11223', protected: true, webUrl: 'https://example.com/common/core-libs/-/tree/master' }, { name: 'refactor/logging-lib', lastCommitSha: 'ddeeff22334', webUrl: 'https://example.com/common/core-libs/-/tree/refactor/logging-lib' } ],
      commits: [
        { sha: 'aabbcc11223', shortSha: 'aabbcc1', message: 'docs: Update README for logging library', authorName: 'Dev Five', authoredDate: new Date(Date.now() - 86400000 * 3).toISOString(), webUrl: 'https://example.com/common/core-libs/-/commit/aabbcc11223' },
        { sha: 'ddeeff22334', shortSha: 'ddeeff2', message: 'refactor: Optimize logging performance', authorName: 'Dev Six', authoredDate: new Date(Date.now() - 86400000 * 3 - 3600000).toISOString(), webUrl: 'https://example.com/common/core-libs/-/commit/ddeeff22334' }
      ],
      mrs: [ { id: 1, iid: 1, title: 'Refactor: Logging Library Optimization', sourceBranch: 'refactor/logging-lib', targetBranch: 'master', status: 'open', authorUsername: 'Dev Six', createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), webUrl: 'https://example.com/common/core-libs/-/merge_requests/1' } ]
    }
  };

  constructor() { }

  getRepositories(): Observable<GitRepository[]> {
    console.warn('GitService: Using mock repository data.');
    return of(this.mockRepositories).pipe(delay(300), tap(d => console.log('Mock repositories:', d)), catchError(() => of([])));
  }

  getBranches(repositoryId: string): Observable<GitBranch[]> {
    console.warn(`GitService: Using mock branch data for repo ${repositoryId}.`);
    const data = this.mockData[repositoryId]?.branches || [];
    return of(data).pipe(delay(300), tap(d => console.log(`Mock branches for ${repositoryId}:`, d)), catchError(() => of([])));
  }

  getCommits(repositoryId: string, branchName?: string): Observable<GitCommit[]> {
    console.warn(`GitService: Using mock commit data for repo ${repositoryId}` + (branchName ? ` on branch ${branchName}` : '') + `.`);
    const data = this.mockData[repositoryId]?.commits || [];
    // In a real scenario, if branchName is provided, filter commits for that branch or make a specific API call
    return of(data).pipe(delay(300), tap(d => console.log(`Mock commits for ${repositoryId}:`, d)), catchError(() => of([])));
  }

  getMergeRequests(repositoryId: string): Observable<GitMergeRequest[]> {
    console.warn(`GitService: Using mock merge request data for repo ${repositoryId}.`);
    const data = this.mockData[repositoryId]?.mrs || [];
    return of(data).pipe(delay(300), tap(d => console.log(`Mock MRs for ${repositoryId}:`, d)), catchError(() => of([])));
  }
}
