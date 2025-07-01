import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CollectionService } from '../services/collection.service';
import { ProjectService } from '../../project/services/project.service';
import { CollectionResponse } from '../models/collection.model';
import { ProjectResponse } from '../../project/models/project.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
  standalone: false
})
export class CollectionListComponent implements OnInit {
  collections: CollectionResponse[] = [];
  project: ProjectResponse | null = null;
  projectId: string = '';
  loading = true;
  error = false;
  displayedColumns: string[] = ['name', 'description', 'testsCount', 'createdAt', 'actions'];

  constructor(
    private collectionService: CollectionService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = id;
        this.loadProject(id);
        this.loadCollections(id);
      } else {
        this.error = true;
        this.loading = false;
        this.snackBar.open('Project ID is required', 'Close', {
          duration: 5000
        });
      }
    });
  }

  /**
   * Load project details
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
   * Load all collections for a project
   * @param projectId The project ID
   */
  loadCollections(projectId: string): void {
    this.loading = true;
    this.error = false;
    
    this.collectionService.getCollections(projectId).subscribe({
      next: (collections) => {
        this.collections = collections;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading collections', err);
        this.error = true;
        this.loading = false;
        this.snackBar.open('Error loading collections. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  /**
   * Navigate to create a new collection
   */
  createCollection(): void {
    this.router.navigate(['/projects', this.projectId, 'collections', 'new']);
  }

  /**
   * Navigate to edit a collection
   * @param collectionId The collection ID to edit
   */
  editCollection(collectionId: string): void {
    this.router.navigate(['/projects', this.projectId, 'collections', collectionId, 'edit']);
  }

  /**
   * Navigate to view a collection's details
   * @param collectionId The collection ID to view
   */
  viewCollection(collectionId: string): void {
    this.router.navigate(['/projects', this.projectId, 'collections', collectionId]);
  }

  /**
   * Delete a collection after confirmation
   * @param collection The collection to delete
   */
  deleteCollection(collection: CollectionResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Collection',
        message: `Are you sure you want to delete the collection "${collection.name}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collectionService.deleteCollection(this.projectId, collection.id).subscribe({
          next: () => {
            this.snackBar.open('Collection deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadCollections(this.projectId); // Reload the list
          },
          error: (err) => {
            console.error('Error deleting collection', err);
            this.snackBar.open('Error deleting collection. Please try again.', 'Close', {
              duration: 5000
            });
          }
        });
      }
    });
  }

  /**
   * Navigate back to projects list
   */
  backToProjects(): void {
    this.router.navigate(['/projects']);
  }

  /**
   * Get the count of tests in a collection
   * @param collection The collection
   * @returns The number of tests
   */
  getTestsCount(collection: CollectionResponse): number {
    return collection.tests?.length || 0;
  }
}
