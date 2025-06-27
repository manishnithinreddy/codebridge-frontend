import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // MatSelectChange is not used here
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { GitService } from './services/git.service';
import { GitRepository } from './models/git-repository.model';
import { GitBranch } from './models/git-branch.model';
import { GitCommit } from './models/git-commit.model';
import { GitMergeRequest } from './models/git-merge-request.model';

@Component({
  selector: 'app-git-repository-manager',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatCardModule, MatButtonModule,
    MatIconModule, MatListModule, MatTabsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatProgressSpinnerModule, DatePipe, SlicePipe, MatTooltipModule
  ],
  templateUrl: './git-repository-manager.component.html',
  styleUrls: ['./git-repository-manager.component.scss']
})
export class GitRepositoryManagerComponent implements OnInit {
  private gitService = inject(GitService);

  repositories$: Observable<GitRepository[]> = of([]);
  selectedRepository: GitRepository | null = null;

  branches$: Observable<GitBranch[]> = of([]);
  commits$: Observable<GitCommit[]> = of([]);
  mergeRequests$: Observable<GitMergeRequest[]> = of([]);

  isLoadingRepos = false;
  isLoadingRepoDetails = false;

  errorRepos: string | null = null;
  errorRepoDetails: string | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadRepositories();
  }

  loadRepositories(): void {
    this.isLoadingRepos = true;
    this.errorRepos = null;
    this.repositories$ = this.gitService.getRepositories().pipe(
      finalize(() => this.isLoadingRepos = false),
      catchError(err => {
        this.errorRepos = 'Failed to load repositories.';
        console.error(err);
        return of<GitRepository[]>([]); // Explicitly type of([])
      }),
      tap(repos => {
        if (repos && repos.length > 0 && !this.selectedRepository) {
          this.onRepositorySelectionChange(repos[0]);
        } else if ((!repos || repos.length === 0) && this.selectedRepository) {
          this.selectedRepository = null;
          this.clearRepoDetails();
        }
      })
    );
  }

  onRepositorySelectionChange(repo: GitRepository): void {
    this.selectedRepository = repo;
    if (repo) {
      this.loadRepositoryDetails(repo.id);
    } else {
      this.clearRepoDetails();
    }
  }

  clearRepoDetails(): void {
    this.branches$ = of([]);
    this.commits$ = of([]);
    this.mergeRequests$ = of([]);
    this.errorRepoDetails = null;
  }

  loadRepositoryDetails(repoId: string): void {
    this.isLoadingRepoDetails = true;
    this.errorRepoDetails = null;

    this.branches$ = this.gitService.getBranches(repoId).pipe(
      catchError(err => {
        this.errorRepoDetails = (this.errorRepoDetails || '') + ' Failed to load branches.';
        console.error(err);
        return of<GitBranch[]>([]); // Explicitly type of([])
      })
    );
    this.commits$ = this.gitService.getCommits(repoId).pipe(
      catchError(err => {
        this.errorRepoDetails = (this.errorRepoDetails || '') + ' Failed to load commits.';
        console.error(err);
        return of<GitCommit[]>([]); // Explicitly type of([])
      })
    );
    this.mergeRequests$ = this.gitService.getMergeRequests(repoId).pipe(
      catchError(err => {
        this.errorRepoDetails = (this.errorRepoDetails || '') + ' Failed to load merge requests.';
        console.error(err);
        return of<GitMergeRequest[]>([]); // Explicitly type of([])
      }),
      finalize(() => this.isLoadingRepoDetails = false)
    );
  }

  createBranch() { console.log('Create new branch for:', this.selectedRepository?.name); }
  createMergeRequest() { console.log('Create new MR for:', this.selectedRepository?.name); }
  viewCommitDetails(commitSha: string) { console.log(`View details for commit: ${commitSha}`);}
}
