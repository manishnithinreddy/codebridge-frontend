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
import { ApiTestService } from '../services/api-test.service';
import { ApiTestResponse } from '../models/api-test.model';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-api-test-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule, 
    MatCardModule, 
    MatTooltipModule, 
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './api-test-list.component.html',
  styleUrls: ['./api-test-list.component.scss']
})
export class ApiTestListComponent implements OnInit {
  private apiTestService = inject(ApiTestService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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
          this.showErrorMessage('Failed to load API tests. Please try again later.');
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

  navigateToManualTester(): void {
    this.router.navigate(['/api-tester/manual']);
  }

  confirmDelete(test: ApiTestResponse): void {
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
          this.showSuccessMessage('Test deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting test:', error);
          this.showErrorMessage('Failed to delete test. Please try again later.');
        }
      });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}

