import { Routes } from '@angular/router';
import { EnvironmentListComponent } from './environment-list/environment-list.component';
import { EnvironmentFormComponent } from './environment-form/environment-form.component';

export const ENVIRONMENT_ROUTES: Routes = [
  { path: '', component: EnvironmentListComponent },
  { path: 'new', component: EnvironmentFormComponent },
  { path: ':id', component: EnvironmentListComponent }, // This will be replaced with an environment detail component
  { path: ':id/edit', component: EnvironmentFormComponent }
];

