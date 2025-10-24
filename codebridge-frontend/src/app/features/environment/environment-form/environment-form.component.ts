import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EnvironmentService } from '../services/environment.service';
import { EnvironmentRequest, EnvironmentResponse, EnvironmentVariable } from '../models/environment.model';

@Component({
  selector: 'app-environment-form',
  templateUrl: './environment-form.component.html',
  styleUrls: ['./environment-form.component.scss']
})
export class EnvironmentFormComponent implements OnInit {
  environmentForm: FormGroup;
  environmentId: string | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;
  error = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private environmentService: EnvironmentService,
    private snackBar: MatSnackBar
  ) {
    this.environmentForm = this.createForm();
  }

  ngOnInit(): void {
    this.environmentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.environmentId;

    if (this.isEditMode && this.environmentId) {
      this.loadEnvironment(this.environmentId);
    }
  }

  /**
   * Create the environment form
   * @returns FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      isDefault: [false],
      variables: this.fb.array([])
    });
  }

  /**
   * Get the variables form array
   */
  get variables(): FormArray {
    return this.environmentForm.get('variables') as FormArray;
  }

  /**
   * Create a variable form group
   * @param variable Optional variable to populate the form
   * @returns FormGroup
   */
  createVariableFormGroup(variable?: EnvironmentVariable): FormGroup {
    return this.fb.group({
      key: [variable?.key || '', [Validators.required, Validators.maxLength(100)]],
      value: [variable?.value || '', [Validators.required, Validators.maxLength(500)]],
      description: [variable?.description || '', Validators.maxLength(200)]
    });
  }

  /**
   * Add a new variable to the form
   */
  addVariable(): void {
    this.variables.push(this.createVariableFormGroup());
  }

  /**
   * Remove a variable from the form
   * @param index The index of the variable to remove
   */
  removeVariable(index: number): void {
    this.variables.removeAt(index);
  }

  /**
   * Load an environment for editing
   * @param id The environment ID
   */
  loadEnvironment(id: string): void {
    this.loading = true;
    this.error = false;
    
    this.environmentService.getEnvironment(id).subscribe({
      next: (environment) => {
        this.populateForm(environment);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading environment', err);
        this.error = true;
        this.errorMessage = 'Failed to load environment. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Populate the form with environment data
   * @param environment The environment data
   */
  populateForm(environment: EnvironmentResponse): void {
    this.environmentForm.patchValue({
      name: environment.name,
      description: environment.description,
      isDefault: environment.isDefault
    });

    // Clear existing variables
    while (this.variables.length) {
      this.variables.removeAt(0);
    }

    // Add variables from the environment
    if (environment.variables && environment.variables.length > 0) {
      environment.variables.forEach(variable => {
        this.variables.push(this.createVariableFormGroup(variable));
      });
    }
  }

  /**
   * Submit the form
   */
  onSubmit(): void {
    if (this.environmentForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.environmentForm);
      return;
    }

    this.submitting = true;
    const environmentData: EnvironmentRequest = this.environmentForm.value;

    if (this.isEditMode && this.environmentId) {
      this.updateEnvironment(this.environmentId, environmentData);
    } else {
      this.createEnvironment(environmentData);
    }
  }

  /**
   * Create a new environment
   * @param environmentData The environment data
   */
  createEnvironment(environmentData: EnvironmentRequest): void {
    this.environmentService.createEnvironment(environmentData).subscribe({
      next: (environment) => {
        this.snackBar.open('Environment created successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/environments']);
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error creating environment', err);
        this.snackBar.open('Error creating environment. Please try again.', 'Close', {
          duration: 5000
        });
        this.submitting = false;
      }
    });
  }

  /**
   * Update an existing environment
   * @param id The environment ID
   * @param environmentData The updated environment data
   */
  updateEnvironment(id: string, environmentData: EnvironmentRequest): void {
    this.environmentService.updateEnvironment(id, environmentData).subscribe({
      next: (environment) => {
        this.snackBar.open('Environment updated successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/environments']);
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error updating environment', err);
        this.snackBar.open('Error updating environment. Please try again.', 'Close', {
          duration: 5000
        });
        this.submitting = false;
      }
    });
  }

  /**
   * Cancel form submission and navigate back
   */
  onCancel(): void {
    this.router.navigate(['/environments']);
  }

  /**
   * Mark all controls in a form group as touched
   * @param formGroup The form group to mark
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }
}

