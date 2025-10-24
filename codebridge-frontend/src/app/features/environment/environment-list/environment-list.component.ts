import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EnvironmentService } from '../services/environment.service';
import { EnvironmentResponse } from '../models/environment.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-environment-list',
  templateUrl: './environment-list.component.html',
  styleUrls: ['./environment-list.component.scss']
})
export class EnvironmentListComponent implements OnInit {
  environments: EnvironmentResponse[] = [];
  loading = true;
  error = false;
  displayedColumns: string[] = ['name', 'description', 'variableCount', 'isDefault', 'actions'];

  constructor(
    private environmentService: EnvironmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadEnvironments();
  }

  /**
   * Load all environments
   */
  loadEnvironments(): void {
    this.loading = true;
    this.error = false;
    
    this.environmentService.getEnvironments().subscribe({
      next: (environments) => {
        this.environments = environments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading environments', err);
        this.error = true;
        this.loading = false;
        this.snackBar.open('Error loading environments. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  /**
   * Set an environment as the default
   * @param environment The environment to set as default
   */
  setAsDefault(environment: EnvironmentResponse): void {
    if (environment.isDefault) {
      return; // Already default
    }

    this.environmentService.setDefaultEnvironment(environment.id).subscribe({
      next: () => {
        this.snackBar.open(`${environment.name} set as default environment`, 'Close', {
          duration: 3000
        });
        this.loadEnvironments(); // Reload to update UI
      },
      error: (err) => {
        console.error('Error setting default environment', err);
        this.snackBar.open('Error setting default environment. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  /**
   * Delete an environment after confirmation
   * @param environment The environment to delete
   */
  deleteEnvironment(environment: EnvironmentResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Environment',
        message: `Are you sure you want to delete "${environment.name}"? This action cannot be undone.`,
        confirmButtonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.environmentService.deleteEnvironment(environment.id).subscribe({
          next: () => {
            this.snackBar.open('Environment deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadEnvironments(); // Reload to update UI
          },
          error: (err) => {
            console.error('Error deleting environment', err);
            this.snackBar.open('Error deleting environment. Please try again.', 'Close', {
              duration: 5000
            });
          }
        });
      }
    });
  }

  /**
   * Get the count of variables in an environment
   * @param environment The environment
   * @returns The number of variables
   */
  getVariableCount(environment: EnvironmentResponse): number {
    return environment.variables?.length || 0;
  }
}

