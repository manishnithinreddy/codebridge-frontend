import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiTestService } from '../services/api-test.service';
import { ApiTestResponse, TestResultResponse } from '../models/api-test.model';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface TestResultWithDetails extends TestResultResponse {
  showDetails: boolean;
}

@Component({
  selector: 'app-api-test-run',
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule, 
    MatCardModule, 
    MatDividerModule, 
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './api-test-run.component.html',
  styleUrls: ['./api-test-run.component.scss']
})
export class ApiTestRunComponent implements OnInit {
  private apiTestService = inject(ApiTestService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  test: ApiTestResponse | null = null;
  testResult: TestResultResponse | null = null;
  previousResults: TestResultWithDetails[] = [];
  isLoading = false;
  isRunning = false;
  testId: string | null = null;
  objectKeys = Object.keys;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.testId = id;
        this.loadTest(id);
        this.loadPreviousResults(id);
      } else {
        this.router.navigate(['/api-tester']);
      }
    });
  }

  loadTest(id: string): void {
    this.isLoading = true;
    this.apiTestService.getTestById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (test) => {
          this.test = test;
        },
        error: (error) => {
          console.error('Error loading test:', error);
          this.showErrorMessage('Failed to load test. Please try again later.');
          this.router.navigate(['/api-tester']);
        }
      });
  }

  loadPreviousResults(id: string): void {
    this.apiTestService.getTestResults(id)
      .subscribe({
        next: (results) => {
          this.previousResults = results.map(result => ({
            ...result,
            showDetails: false
          }));
        },
        error: (error) => {
          console.error('Error loading test results:', error);
          this.showErrorMessage('Failed to load test results. Please try again later.');
        }
      });
  }

  runTest(): void {
    if (!this.testId) return;

    this.isRunning = true;
    this.testResult = null;

    this.apiTestService.executeTest(this.testId)
      .pipe(finalize(() => this.isRunning = false))
      .subscribe({
        next: (result) => {
          this.testResult = result;
          // Add to previous results
          this.previousResults.unshift({
            ...result,
            showDetails: false
          });
          this.showSuccessMessage('Test executed successfully');
        },
        error: (error) => {
          console.error('Error executing test:', error);
          this.showErrorMessage('Failed to execute test. Please try again later.');
        }
      });
  }

  navigateBack(): void {
    this.router.navigate(['/api-tester']);
  }

  formatJson(jsonString: string | undefined): string {
    if (!jsonString) return '';
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return jsonString;
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'PASSED':
        return 'primary';
      case 'FAILED':
        return 'warn';
      case 'ERROR':
        return 'accent';
      default:
        return '';
    }
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

