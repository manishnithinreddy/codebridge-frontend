import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProjectService } from '../services/project.service';
import { ProjectResponse } from '../models/project.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: ProjectResponse[] = [];
  loading = true;
  error = false;
  displayedColumns: string[] = ['name', 'description', 'createdAt', 'actions'];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  /**
   * Load all projects for the current user
   */
  loadProjects(): void {
    this.loading = true;
    this.error = false;
    
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading projects', err);
        this.error = true;
        this.loading = false;
        this.snackBar.open('Error loading projects. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  /**
   * Navigate to create a new project
   */
  createProject(): void {
    this.router.navigate(['/projects/new']);
  }

  /**
   * Navigate to edit a project
   * @param id The project ID to edit
   */
  editProject(id: string): void {
    this.router.navigate(['/projects', id, 'edit']);
  }

  /**
   * Navigate to view a project's details
   * @param id The project ID to view
   */
  viewProject(id: string): void {
    this.router.navigate(['/projects', id]);
  }

  /**
   * Delete a project after confirmation
   * @param project The project to delete
   */
  deleteProject(project: ProjectResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Project',
        message: `Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(project.id).subscribe({
          next: () => {
            this.snackBar.open('Project deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadProjects(); // Reload the list
          },
          error: (err) => {
            console.error('Error deleting project', err);
            this.snackBar.open('Error deleting project. Please try again.', 'Close', {
              duration: 5000
            });
          }
        });
      }
    });
  }
}

