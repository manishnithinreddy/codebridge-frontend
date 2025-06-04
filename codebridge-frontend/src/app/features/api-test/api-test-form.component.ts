import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiTestService } from './services/api-test.service';
import { ApiTestRequest, ApiTestResponse } from './models/api-test.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-api-test-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTabsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="api-test-form-container">
      <h1>{{ isEditMode ? 'Edit API Test' : 'Create API Test' }}</h1>

      <div *ngIf="isLoading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <form [formGroup]="testForm" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Test Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter test name">
            <mat-error *ngIf="testForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" placeholder="Enter test description" rows="2"></textarea>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="method-select">
            <mat-label>Method</mat-label>
            <mat-select formControlName="method">
              <mat-option *ngFor="let method of httpMethods" [value]="method">
                {{ method }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="testForm.get('method')?.hasError('required')">
              Method is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="url-input">
            <mat-label>URL</mat-label>
            <input matInput formControlName="url" placeholder="Enter request URL">
            <mat-error *ngIf="testForm.get('url')?.hasError('required')">
              URL is required
            </mat-error>
          </mat-form-field>
        </div>

        <mat-tab-group animationDuration="0ms">
          <mat-tab label="Headers">
            <div formArrayName="headers" class="params-headers-table">
              <div *ngFor="let header of headers.controls; let i=index" [formGroupName]="i" class="table-row">
                <mat-form-field appearance="outline" class="key-input">
                  <input matInput formControlName="key" placeholder="Key">
                </mat-form-field>
                <mat-form-field appearance="outline" class="value-input">
                  <input matInput formControlName="value" placeholder="Value">
                </mat-form-field>
                <button type="button" mat-icon-button (click)="removeHeader(i)" aria-label="Remove header">
                  <mat-icon>remove_circle_outline</mat-icon>
                </button>
              </div>
              <button type="button" mat-stroked-button (click)="addHeader()">
                <mat-icon>add</mat-icon> Add Header
              </button>
            </div>
          </mat-tab>

          <mat-tab label="Request Body">
            <mat-form-field appearance="outline" class="body-textarea">
              <mat-label>Request Body (JSON)</mat-label>
              <textarea matInput formControlName="requestBody" rows="10" placeholder="Enter JSON body"></textarea>
            </mat-form-field>
          </mat-tab>

          <mat-tab label="Expected Response">
            <div class="form-row">
              <mat-form-field appearance="outline" class="status-code-input">
                <mat-label>Expected Status Code</mat-label>
                <input matInput type="number" formControlName="expectedStatusCode" placeholder="e.g., 200">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="body-textarea">
              <mat-label>Expected Response Body (JSON)</mat-label>
              <textarea matInput formControlName="expectedResponseBody" rows="10" placeholder="Enter expected JSON response"></textarea>
            </mat-form-field>
          </mat-tab>

          <mat-tab label="Validation">
            <mat-form-field appearance="outline" class="body-textarea">
              <mat-label>Validation Script</mat-label>
              <textarea matInput formControlName="validationScript" rows="10" placeholder="Enter validation script"></textarea>
            </mat-form-field>
          </mat-tab>
        </mat-tab-group>

        <div class="form-row">
          <mat-form-field appearance="outline" class="timeout-input">
            <mat-label>Timeout (ms)</mat-label>
            <input matInput type="number" formControlName="timeoutMs" placeholder="e.g., 5000">
            <mat-error *ngIf="testForm.get('timeoutMs')?.hasError('required')">
              Timeout is required
            </mat-error>
            <mat-error *ngIf="testForm.get('timeoutMs')?.hasError('min')">
              Timeout must be at least 1000 ms
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button type="button" mat-button (click)="cancel()">Cancel</button>
          <button type="submit" mat-raised-button color="primary" [disabled]="testForm.invalid || isSaving">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .api-test-form-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 50px 0;
    }
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .full-width {
      width: 100%;
    }
    .method-select {
      width: 150px;
    }
    .url-input {
      flex: 1;
    }
    .timeout-input {
      width: 200px;
    }
    .params-headers-table {
      padding: 16px 0;
    }
    .table-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
      align-items: center;
    }
    .key-input, .value-input {
      flex: 1;
    }
    .body-textarea {
      width: 100%;
      margin: 16px 0;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
  `]
})
export class ApiTestFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiTestService = inject(ApiTestService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  testForm: FormGroup;
  isLoading = false;
  isSaving = false;
  isEditMode = false;
  testId: string | null = null;
  httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  constructor() {
    this.testForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      method: ['GET', Validators.required],
      url: ['', Validators.required],
      headers: this.fb.array([]),
      requestBody: [''],
      expectedStatusCode: [null],
      expectedResponseBody: [''],
      validationScript: [''],
      timeoutMs: [5000, [Validators.required, Validators.min(1000)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.testId = id;
        this.loadTest(id);
      }
    });
  }

  get headers() { return this.testForm.get('headers') as FormArray; }

  addHeader() {
    this.headers.push(this.fb.group({
      key: [''],
      value: ['']
    }));
  }

  removeHeader(index: number) {
    this.headers.removeAt(index);
  }

  loadTest(id: string): void {
    this.isLoading = true;
    this.apiTestService.getTestById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (test) => {
          this.populateForm(test);
        },
        error: (error) => {
          console.error('Error loading test:', error);
          this.router.navigate(['/api-tester']);
        }
      });
  }

  populateForm(test: ApiTestResponse): void {
    this.testForm.patchValue({
      name: test.name,
      description: test.description || '',
      method: test.method,
      url: test.url,
      requestBody: test.requestBody || '',
      expectedStatusCode: test.expectedStatusCode,
      expectedResponseBody: test.expectedResponseBody || '',
      validationScript: test.validationScript || '',
      timeoutMs: test.timeoutMs
    });

    // Clear existing headers
    while (this.headers.length) {
      this.headers.removeAt(0);
    }

    // Add headers from the test
    if (test.headers) {
      Object.entries(test.headers).forEach(([key, value]) => {
        this.headers.push(this.fb.group({
          key: [key],
          value: [value]
        }));
      });
    }
  }

  onSubmit(): void {
    if (this.testForm.invalid) {
      this.testForm.markAllAsTouched();
      return;
    }

    const formValue = this.testForm.value;
    
    // Convert headers array to object
    const headersObject: Record<string, string> = {};
    formValue.headers.forEach((header: { key: string, value: string }) => {
      if (header.key) {
        headersObject[header.key] = header.value;
      }
    });

    const request: ApiTestRequest = {
      name: formValue.name,
      description: formValue.description,
      method: formValue.method,
      url: formValue.url,
      headers: Object.keys(headersObject).length > 0 ? headersObject : undefined,
      requestBody: formValue.requestBody || undefined,
      expectedStatusCode: formValue.expectedStatusCode || undefined,
      expectedResponseBody: formValue.expectedResponseBody || undefined,
      validationScript: formValue.validationScript || undefined,
      timeoutMs: formValue.timeoutMs
    };

    this.isSaving = true;
    
    if (this.isEditMode && this.testId) {
      this.apiTestService.updateTest(this.testId, request)
        .pipe(finalize(() => this.isSaving = false))
        .subscribe({
          next: () => {
            this.router.navigate(['/api-tester']);
          },
          error: (error) => {
            console.error('Error updating test:', error);
          }
        });
    } else {
      this.apiTestService.createTest(request)
        .pipe(finalize(() => this.isSaving = false))
        .subscribe({
          next: () => {
            this.router.navigate(['/api-tester']);
          },
          error: (error) => {
            console.error('Error creating test:', error);
          }
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/api-tester']);
  }
}

