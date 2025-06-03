import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../core/http/api.service'; // Corrected path
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-api-test-runner',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTabsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatTableModule,
    MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './api-test-runner.component.html',
  styleUrls: ['./api-test-runner.component.scss']
})
export class ApiTestRunnerComponent {
  requestForm: FormGroup;
  isLoading = false;
  httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  constructor() {
    this.requestForm = this.fb.group({
      method: ['GET', Validators.required],
      url: ['', Validators.required],
      queryParams: this.fb.array([]),
      headers: this.fb.array([]),
      body: [''],
      responseStatus: [''],
      responseBody: [''],
      responseHeaders: ['']
    });
  }

  get queryParams() { return this.requestForm.get('queryParams') as FormArray; }
  addQueryParam() { this.queryParams.push(this.fb.group({ key: [''], value: [''] })); }
  removeQueryParam(index: number) { this.queryParams.removeAt(index); }

  get headers() { return this.requestForm.get('headers') as FormArray; }
  addHeader() { this.headers.push(this.fb.group({ key: [''], value: [''] })); }
  removeHeader(index: number) { this.headers.removeAt(index); }

  sendRequest() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.requestForm.patchValue({ responseStatus: '', responseBody: '', responseHeaders: '' });

    const formValue = this.requestForm.value;
    const method = formValue.method.toUpperCase();
    const url = formValue.url;

    let httpParams = new HttpParams();
    formValue.queryParams.forEach((param: { key: string, value: string }) => {
      if (param.key) httpParams = httpParams.append(param.key, param.value);
    });

    let httpHeaders = new HttpHeaders();
    formValue.headers.forEach((header: { key: string, value: string }) => {
      if (header.key) httpHeaders = httpHeaders.append(header.key, header.value);
    });

    let requestBody: any = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (!httpHeaders.has('Content-Type')) {
          httpHeaders = httpHeaders.append('Content-Type', 'application/json');
      }
      try {
        requestBody = formValue.body ? JSON.parse(formValue.body) : {};
      } catch (e) {
        this.isLoading = false;
        this.requestForm.patchValue({
          responseStatus: 'Error: Invalid JSON Body',
          responseBody: 'The provided request body is not valid JSON.',
        });
        return;
      }
    }

    let response$: Observable<HttpResponse<any>>;

    const options = { headers: httpHeaders, params: httpParams, observe: 'response' as const };

    switch (method) {
      case 'GET':     response$ = this.apiService.get(url, httpParams, options); break;
      case 'POST':    response$ = this.apiService.post(url, requestBody, options); break;
      case 'PUT':     response$ = this.apiService.put(url, requestBody, options); break;
      case 'DELETE':  response$ = this.apiService.delete(url, options); break;
      case 'PATCH':   response$ = this.apiService.patch(url, requestBody, options); break;
      case 'HEAD':    response$ = this.apiService.head(url, { params: httpParams, headers: httpHeaders }); break; // Omit observe from options for HEAD/OPTIONS
      case 'OPTIONS': response$ = this.apiService.options(url, { params: httpParams, headers: httpHeaders }); break; // Omit observe from options for HEAD/OPTIONS
      default:
        this.isLoading = false;
        this.requestForm.patchValue({ responseStatus: 'Error: Unsupported method' });
        return;
    }

    response$.pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: HttpResponse<any>) => {
          this.requestForm.patchValue({
            responseStatus: `${res.status} ${res.statusText}`,
            responseBody: JSON.stringify(res.body, null, 2),
            responseHeaders: JSON.stringify(this.parseHeaders(res.headers), null, 2)
          });
        },
        error: (err: HttpErrorResponse) => {
          this.requestForm.patchValue({
            responseStatus: `${err.status || 'Error'} ${err.statusText || ''} (${err.name || ''})`.trim(),
            responseBody: JSON.stringify(err.error || err.message, null, 2),
            responseHeaders: JSON.stringify(this.parseHeaders(err.headers), null, 2)
          });
        }
      });
  }

  private parseHeaders(headers: HttpHeaders): any {
    const result: any = {};
    headers.keys().forEach(key => { result[key] = headers.getAll(key)?.join(', '); });
    return result;
  }
}
