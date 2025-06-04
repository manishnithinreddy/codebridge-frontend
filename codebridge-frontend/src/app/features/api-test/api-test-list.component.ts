import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiTestService } from './services/api-test.service';
import { ApiTestResponse } from './models/api-test.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-api-test-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatCardModule, MatTooltipModule, MatDialogModule
  ],
  template: `
    <div class="api-test-list-container">
      <div class="header-actions">
        <h1>API Tests</h1>
        <button mat-raised-button color="primary" (click)="navigateToCreate()">
          <mat-icon>add</mat-icon> Create New Test
        </button>
      </div>

      <div *ngIf="isLoading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!isLoading && tests.length === 0" class="no-tests">
        <mat-card>
          <mat-card-content>
            <p>No API tests found. Create your first test to get started!</p>
            <button mat-raised-button color="primary" (click)="navigateToCreate()">
              Create New Test
            </button>
          </mat-card-content>
        </mat-card>
      </div>

      <table mat-table [dataSource]="tests" class="mat-elevation-z2" *ngIf="!isLoading && tests.length > 0">
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let test">{{ test.name }}</td>
        </ng-container>

        <!-- URL Column -->
        <ng-container matColumnDef="url">
          <th mat-header-cell *matHeaderCellDef>URL</th>
          <td mat-cell *matCellDef="let test" [matTooltip]="test.url">
            {{ test.url | slice:0:50 }}{{ test.url.length > 50 ? '...' : '' }}
          </td>
        </ng-container>

        <!-- Method Column -->
        <ng-container matColumnDef="method">
          <th mat-header-cell *matHeaderCellDef>Method</th>
          <td mat-cell *matCellDef="let test">{{ test.method }}</td>
        </ng-container>

        <!-- Created At Column -->
        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Created</th>
          <td mat-cell *matCellDef="let test">{{ test.createdAt | date:'short' }}</td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let test">
            <button mat-icon-button color="primary" matTooltip="Edit" (click)="navigateToEdit(test.id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="accent" matTooltip="Run Test" (click)="executeTest(test.id)">
              <mat-icon>play_arrow</mat-icon>
            </button>
            <button mat-icon-button color="warn" matTooltip="Delete" (click)="confirmDelete(test)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .api-test-list-container {
      padding: 20px;
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 50px 0;
    }
    .no-tests {
      margin: 30px 0;
      text-align: center;
    }
    .no-tests p {
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class ApiTestListComponent implements OnInit {
  private apiTestService = inject(ApiTestService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  tests: ApiTestResponse[] = [];
  isLoading = false;
  displayedColumns: string[] = ['name', 'url', 'method', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.isLoading = true;
    this.apiTestService.getAllTests()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (tests) => {
          this.tests = tests;
        },
        error: (error) => {
          console.error('Error loading tests:', error);
          // You could add a snackbar or toast notification here
        }
      });
  }

  navigateToCreate(): void {
    this.router.navigate(['/api-tester/create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/api-tester/edit', id]);
  }

  executeTest(id: string): void {
    this.router.navigate(['/api-tester/run', id]);
  }

  confirmDelete(test: ApiTestResponse): void {
    // In a real implementation, you would show a confirmation dialog
    if (confirm(`Are you sure you want to delete the test "${test.name}"?`)) {
      this.deleteTest(test.id);
    }
  }

  deleteTest(id: string): void {
    this.isLoading = true;
    this.apiTestService.deleteTest(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.tests = this.tests.filter(test => test.id !== id);
          // You could add a snackbar or toast notification here
        },
        error: (error) => {
          console.error('Error deleting test:', error);
          // You could add a snackbar or toast notification here
        }
      });
  }
}

