import { Routes } from '@angular/router';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';

export const COLLECTION_ROUTES: Routes = [
  { path: '', component: CollectionListComponent },
  { path: 'new', component: CollectionFormComponent },
  { path: ':id', component: CollectionListComponent }, // This will be replaced with a collection detail component
  { path: ':id/edit', component: CollectionFormComponent }
];

