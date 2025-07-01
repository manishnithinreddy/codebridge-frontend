import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ProjectService } from '../services/project.service';
import { ProjectRequest, ProjectResponse } from '../models/project.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  standalone: false
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId: string | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    if (this.isEditMode && this.projectId) {
      this.loadProject(this.projectId);
    }
  }

  /**
   * Load project data for editing
   * @param id The project ID to load
   */
  loadProject(id: string): void {
    this.loading = true;
    this.error = null;

    this.projectService.getProject(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          name: project.name,
          description: project.description
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading project', err);
        this.error = 'Failed to load project. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Submit the form to create or update a project
   */
  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.submitting = true;
    const projectData: ProjectRequest = this.projectForm.value;
    
    let request$: Observable<ProjectResponse>;
    
    if (this.isEditMode && this.projectId) {
      request$ = this.projectService.updateProject(this.projectId, projectData);
    } else {
      request$ = this.projectService.createProject(projectData);
    }

    request$.pipe(
      catchError(err => {
        console.error('Error saving project', err);
        this.snackBar.open('Error saving project. Please try again.', 'Close', {
          duration: 5000
        });
        this.submitting = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        const message = this.isEditMode ? 'Project updated successfully' : 'Project created successfully';
        this.snackBar.open(message, 'Close', {
          duration: 3000
        });
        this.router.navigate(['/projects']);
      }
      this.submitting = false;
    });
  }

  /**
   * Cancel form and navigate back to projects list
   */
  onCancel(): void {
    this.router.navigate(['/projects']);
  }
}
