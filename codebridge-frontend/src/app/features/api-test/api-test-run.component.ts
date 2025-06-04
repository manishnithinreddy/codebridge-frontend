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
import { ApiTestService } from './services/api-test.service';
import { ApiTestResponse, TestResultResponse } from './models/api-test.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-api-test-run',
  standalone: true,
  imports: [
    CommonModule, MatTabsModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatCardModule, MatDividerModule, MatChipsModule
  ],
  template: `
    <div class="api-test-run-container">
      <div class="header-actions">
        <h1>Run API Test</h1>
        <div>
          <button mat-button (click)="navigateBack()">
            <mat-icon>arrow_back</mat-icon> Back to Tests
          </button>
          <button mat-raised-button color="primary" (click)="runTest()" [disabled]="isRunning">
            <mat-icon>play_arrow</mat-icon> Run Test
          </button>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <ng-container *ngIf="!isLoading && test">
        <mat-card class="test-details">
          <mat-card-header>
            <mat-card-title>{{ test.name }}</mat-card-title>
            <mat-card-subtitle>{{ test.description }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="test-info">
              <div class="info-row">
                <strong>Method:</strong> {{ test.method }}
              </div>
              <div class="info-row">
                <strong>URL:</strong> {{ test.url }}
              </div>
              <div class="info-row" *ngIf="test.headers && objectKeys(test.headers).length > 0">
                <strong>Headers:</strong>
                <pre>{{ test.headers | json }}</pre>
              </div>
              <div class="info-row" *ngIf="test.requestBody">
                <strong>Request Body:</strong>
                <pre>{{ formatJson(test.requestBody) }}</pre>
              </div>
              <div class="info-row" *ngIf="test.expectedStatusCode">
                <strong>Expected Status:</strong> {{ test.expectedStatusCode }}
              </div>
              <div class="info-row" *ngIf="test.expectedResponseBody">
                <strong>Expected Response:</strong>
                <pre>{{ formatJson(test.expectedResponseBody) }}</pre>
              </div>
              <div class="info-row">
                <strong>Timeout:</strong> {{ test.timeoutMs }} ms
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <div *ngIf="isRunning" class="running-indicator">
          <mat-spinner diameter="30"></mat-spinner>
          <span>Running test...</span>
        </div>

        <div *ngIf="testResult" class="test-result">
          <h2>Test Result</h2>
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <mat-chip [color]="getStatusColor(testResult.status)" selected>
                  {{ testResult.status }}
                </mat-chip>
                <span *ngIf="testResult.responseStatusCode" class="status-code">
                  Status: {{ testResult.responseStatusCode }}
                </span>
              </mat-card-title>
              <mat-card-subtitle *ngIf="testResult.executionTimeMs">
                Execution Time: {{ testResult.executionTimeMs }} ms
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="testResult.errorMessage" class="error-message">
                <strong>Error:</strong> {{ testResult.errorMessage }}
              </div>

              <mat-tab-group animationDuration="0ms" *ngIf="!testResult.errorMessage">
                <mat-tab label="Response Body">
                  <pre class="response-body">{{ formatJson(testResult.responseBody) }}</pre>
                </mat-tab>
                <mat-tab label="Response Headers" *ngIf="testResult.responseHeaders">
                  <pre class="response-headers">{{ testResult.responseHeaders | json }}</pre>
                </mat-tab>
              </mat-tab-group>
            </mat-card-content>
          </mat-card>
        </div>

        <div *ngIf="previousResults.length > 0" class="previous-results">
          <h2>Previous Results</h2>
          <mat-card *ngFor="let result of previousResults" class="result-card">
            <mat-card-header>
              <mat-card-title>
                <mat-chip [color]="getStatusColor(result.status)" selected>
                  {{ result.status }}
                </mat-chip>
                <span *ngIf="result.responseStatusCode" class="status-code">
                  Status: {{ result.responseStatusCode }}
                </span>
              </mat-card-title>
              <mat-card-subtitle>
                {{ result.createdAt | date:'medium' }}
                <span *ngIf="result.executionTimeMs"> • {{ result.executionTimeMs }} ms</span>
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content *ngIf="result.errorMessage">
              <div class="error-message">
                <strong>Error:</strong> {{ result.errorMessage }}
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button (click)="result.showDetails = !result.showDetails">
                {{ result.showDetails ? 'Hide Details' : 'Show Details' }}
              </button>
            </mat-card-actions>
            <mat-card-content *ngIf="result.showDetails">
              <mat-tab-group animationDuration="0ms" *ngIf="!result.errorMessage">
                <mat-tab label="Response Body">
                  <pre class="response-body">{{ formatJson(result.responseBody) }}</pre>
                </mat-tab>
                <mat-tab label="Response Headers" *ngIf="result.responseHeaders">
                  <pre class="response-headers">{{ result.responseHeaders | json }}</pre>
                </mat-tab>
              </mat-tab-group>
            </mat-card-content>
          </mat-card>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .api-test-run-container {
      padding: 20px;
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .header-actions button {
      margin-left: 10px;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 50px 0;
    }
    .test-details {
      margin-bottom: 20px;
    }
    .test-info {
      margin-top: 16px;
    }
    .info-row {
      margin-bottom: 12px;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
      max-height: 300px;
    }
    .running-indicator {
      display: flex;
      align-items: center;
      margin: 20px 0;
    }
    .running-indicator span {
      margin-left: 10px;
    }
    .test-result {
      margin-top: 30px;
    }
    .status-code {
      margin-left: 10px;
    }
    .error-message {
      color: #f44336;
      margin: 10px 0;
    }
    .previous-results {
      margin-top: 30px;
    }
    .result-card {
      margin-bottom: 16px;
    }
    .response-body, .response-headers {
      margin-top: 10px;
    }
  `]
})
export class ApiTestRunComponent implements OnInit {
  private apiTestService = inject(ApiTestService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  test: ApiTestResponse | null = null;
  testResult: TestResultResponse | null = null;
  previousResults: (TestResultResponse & { showDetails: boolean })[] = [];
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
        },
        error: (error) => {
          console.error('Error executing test:', error);
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
}

