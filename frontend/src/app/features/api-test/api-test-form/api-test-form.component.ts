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
import { ApiTestService } from '../services/api-test.service';
import { ApiTestRequest, ApiTestResponse } from '../models/api-test.model';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-api-test-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatTabsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './api-test-form.component.html',
  styleUrls: ['./api-test-form.component.scss']
})
export class ApiTestFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiTestService = inject(ApiTestService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

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
          this.showErrorMessage('Failed to load test. Please try again later.');
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
            this.showSuccessMessage('Test updated successfully');
            this.router.navigate(['/api-tester']);
          },
          error: (error) => {
            console.error('Error updating test:', error);
            this.showErrorMessage('Failed to update test. Please try again later.');
          }
        });
    } else {
      this.apiTestService.createTest(request)
        .pipe(finalize(() => this.isSaving = false))
        .subscribe({
          next: () => {
            this.showSuccessMessage('Test created successfully');
            this.router.navigate(['/api-tester']);
          },
          error: (error) => {
            console.error('Error creating test:', error);
            this.showErrorMessage('Failed to create test. Please try again later.');
          }
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/api-tester']);
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

