import { Routes } from '@angular/router';

import { ProjectListComponent } from './features/project/project-list/project-list.component';
import { ProjectFormComponent } from './features/project/project-form/project-form.component';
import { CollectionListComponent } from './features/collection/collection-list/collection-list.component';
import { CollectionFormComponent } from './features/collection/collection-form/collection-form.component';
import { EnvironmentListComponent } from './features/environment/environment-list/environment-list.component';
import { EnvironmentFormComponent } from './features/environment/environment-form/environment-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: ProjectFormComponent },
  { path: 'projects/:id', component: ProjectListComponent }, // This will be replaced with a project detail component
  { path: 'projects/:id/edit', component: ProjectFormComponent },
  { path: 'projects/:projectId/collections', component: CollectionListComponent },
  { path: 'projects/:projectId/collections/new', component: CollectionFormComponent },
  { path: 'projects/:projectId/collections/:id', component: CollectionListComponent }, // This will be replaced with a collection detail component
  { path: 'projects/:projectId/collections/:id/edit', component: CollectionFormComponent },
  { path: 'environments', component: EnvironmentListComponent },
  { path: 'environments/new', component: EnvironmentFormComponent },
  { path: 'environments/:id', component: EnvironmentListComponent }, // This will be replaced with an environment detail component
  { path: 'environments/:id/edit', component: EnvironmentFormComponent },
  { path: '**', redirectTo: '/projects' }
];

