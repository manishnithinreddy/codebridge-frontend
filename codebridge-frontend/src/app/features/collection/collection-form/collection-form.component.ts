import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CollectionService } from '../services/collection.service';
import { ProjectService } from '../../project/services/project.service';
import { CollectionRequest, CollectionResponse } from '../models/collection.model';
import { ProjectResponse } from '../../project/models/project.model';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.scss']
})
export class CollectionFormComponent implements OnInit {
  collectionForm: FormGroup;
  isEditMode = false;
  projectId: string = '';
  collectionId: string | null = null;
  project: ProjectResponse | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.collectionForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      variables: this.fb.group({}),
      preRequestScript: [''],
      postRequestScript: [''],
      shared: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('projectId');
      if (!projectId) {
        this.snackBar.open('Project ID is required', 'Close', { duration: 5000 });
        this.router.navigate(['/projects']);
        return;
      }

      this.projectId = projectId;
      this.loadProject(projectId);

      this.collectionId = params.get('id');
      this.isEditMode = !!this.collectionId;

      if (this.isEditMode && this.collectionId) {
        this.loadCollection(projectId, this.collectionId);
      }
    });
  }

  /**
   * Load project data
   * @param projectId The project ID
   */
  loadProject(projectId: string): void {
    this.projectService.getProject(projectId).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (err) => {
        console.error('Error loading project', err);
        this.snackBar.open('Error loading project details', 'Close', {
          duration: 5000
        });
      }
    });
  }

  /**
   * Load collection data for editing
   * @param projectId The project ID
   * @param collectionId The collection ID
   */
  loadCollection(projectId: string, collectionId: string): void {
    this.loading = true;
    this.error = null;

    this.collectionService.getCollection(projectId, collectionId).subscribe({
      next: (collection) => {
        // Create form controls for variables
        if (collection.variables) {
          const variablesGroup = this.collectionForm.get('variables') as FormGroup;
          Object.entries(collection.variables).forEach(([key, value]) => {
            variablesGroup.addControl(key, this.fb.control(value));
          });
        }

        this.collectionForm.patchValue({
          name: collection.name,
          description: collection.description,
          preRequestScript: collection.preRequestScript,
          postRequestScript: collection.postRequestScript,
          shared: collection.shared
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading collection', err);
        this.error = 'Failed to load collection. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Add a new variable to the form
   */
  addVariable(key: string = '', value: string = ''): void {
    const variablesGroup = this.collectionForm.get('variables') as FormGroup;
    const newKey = key || `variable_${Object.keys(variablesGroup.controls).length + 1}`;
    variablesGroup.addControl(newKey, this.fb.control(value));
  }

  /**
   * Remove a variable from the form
   * @param key The variable key to remove
   */
  removeVariable(key: string): void {
    const variablesGroup = this.collectionForm.get('variables') as FormGroup;
    variablesGroup.removeControl(key);
  }

  /**
   * Get all variables as key-value pairs
   */
  getVariables(): Record<string, string> {
    const variablesGroup = this.collectionForm.get('variables') as FormGroup;
    const variables: Record<string, string> = {};
    
    Object.keys(variablesGroup.controls).forEach(key => {
      variables[key] = variablesGroup.get(key)?.value;
    });
    
    return variables;
  }

  /**
   * Submit the form to create or update a collection
   */
  onSubmit(): void {
    if (this.collectionForm.invalid) {
      return;
    }

    this.submitting = true;
    const formValue = this.collectionForm.value;
    
    const collectionData: CollectionRequest = {
      name: formValue.name,
      description: formValue.description,
      variables: this.getVariables(),
      preRequestScript: formValue.preRequestScript,
      postRequestScript: formValue.postRequestScript,
      shared: formValue.shared,
      projectId: this.projectId
    };
    
    let request$: Observable<CollectionResponse>;
    
    if (this.isEditMode && this.collectionId) {
      request$ = this.collectionService.updateCollection(this.projectId, this.collectionId, collectionData);
    } else {
      request$ = this.collectionService.createCollection(collectionData);
    }

    request$.pipe(
      catchError(err => {
        console.error('Error saving collection', err);
        this.snackBar.open('Error saving collection. Please try again.', 'Close', {
          duration: 5000
        });
        this.submitting = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        const message = this.isEditMode ? 'Collection updated successfully' : 'Collection created successfully';
        this.snackBar.open(message, 'Close', {
          duration: 3000
        });
        this.router.navigate(['/projects', this.projectId, 'collections']);
      }
      this.submitting = false;
    });
  }

  /**
   * Cancel form and navigate back to collections list
   */
  onCancel(): void {
    this.router.navigate(['/projects', this.projectId, 'collections']);
  }

  /**
   * Get all variable keys
   */
  get variableKeys(): string[] {
    const variablesGroup = this.collectionForm.get('variables') as FormGroup;
    return Object.keys(variablesGroup.controls);
  }
}

