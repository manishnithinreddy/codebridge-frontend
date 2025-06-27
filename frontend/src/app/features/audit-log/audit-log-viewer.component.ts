import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core'; // Added ViewChild, AfterViewInit
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { Observable, of, Subject, merge } from 'rxjs'; // Added merge
import { catchError, finalize, debounceTime, distinctUntilChanged, switchMap, startWith, tap } from 'rxjs/operators';

import { AuditLogService } from './services/audit-log.service';
import { AuditLogItem } from './models/audit-log-item.model';

@Component({
  selector: 'app-audit-log-viewer',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, DatePipe,
    MatToolbarModule, MatCardModule, MatListModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule,
    MatPaginatorModule, MatSortModule
  ],
  templateUrl: './audit-log-viewer.component.html',
  styleUrls: ['./audit-log-viewer.component.scss']
})
export class AuditLogViewerComponent implements OnInit, AfterViewInit {
  private auditLogService = inject(AuditLogService);
  private fb = inject(FormBuilder);

  dataSource = new MatTableDataSource<AuditLogItem>();
  isLoading = true; // Start with loading true
  error: string | null = null;

  filterForm: FormGroup;
  private filterSubject = new Subject<void>();

  displayedColumns: string[] = ['timestamp', 'userName', 'serviceName', 'action', 'entityName', 'status', 'details'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.filterForm = this.fb.group({
      userName: [''],
      action: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.applyFilters()) // Trigger load on value change
    ).subscribe();

    // Initial load
    this.loadAuditLogs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // If using server-side pagination/sorting, listen to page/sort events here
    // For client-side, MatTableDataSource handles it.
  }

  applyFilters(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.isLoading = true;
    this.error = null;
    const filters = this.filterForm.value;

    this.auditLogService.getAuditLogs(filters).pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        this.error = 'Failed to load audit logs.';
        console.error(err);
        return of([]); // Return empty array on error
      })
    ).subscribe(logs => {
      this.dataSource.data = logs;
      if (this.paginator) { // Re-apply paginator if data reloads
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) { // Re-apply sort if data reloads
         this.dataSource.sort = this.sort;
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset({ userName: '', action: '', status: '' });
    // loadAuditLogs will be triggered by valueChanges
  }

  viewDetails(logItem: AuditLogItem): void {
    alert(JSON.stringify(logItem.details, null, 2));
  }
}
