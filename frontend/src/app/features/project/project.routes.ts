import { Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';

export const PROJECT_ROUTES: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'new', component: ProjectFormComponent },
  { path: ':id', component: ProjectListComponent }, // This will be replaced with a project detail component
  { path: ':id/edit', component: ProjectFormComponent },
  { 
    path: ':projectId/collections', 
    loadChildren: () => import('../collection/collection.routes').then(m => m.COLLECTION_ROUTES) 
  }
];

