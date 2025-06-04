import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ProjectSharingService } from '../services/project-sharing.service';
import { ShareGrantRequest, ShareGrantResponse, SharePermissionLevel } from '../models/project-sharing.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-sharing-list',
  templateUrl: './project-sharing-list.component.html',
  styleUrls: ['./project-sharing-list.component.scss']
})
export class ProjectSharingListComponent implements OnInit {
  @Input() projectId!: string;
  
  shareForm: FormGroup;
  shares: ShareGrantResponse[] = [];
  loading = true;
  submitting = false;
  error = false;
  displayedColumns: string[] = ['email', 'permissionLevel', 'createdAt', 'actions'];
  permissionLevels = Object.values(SharePermissionLevel);

  constructor(
    private fb: FormBuilder,
    private projectSharingService: ProjectSharingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      permissionLevel: [SharePermissionLevel.VIEW_ONLY, Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.projectId) {
      console.error('Project ID is required for ProjectSharingListComponent');
      this.error = true;
      this.loading = false;
      return;
    }

    this.loadShares();
  }

  /**
   * Load all share grants for a project
   */
  loadShares(): void {
    this.loading = true;
    this.error = false;
    
    this.projectSharingService.getShareGrants(this.projectId).subscribe({
      next: (shares) => {
        this.shares = shares;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading shares', err);
        this.error = true;
        this.loading = false;
        this.snackBar.open('Error loading shares. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  /**
   * Add a new share grant
   */
  addShare(): void {
    if (this.shareForm.invalid) {
      return;
    }

    this.submitting = true;
    const shareData: ShareGrantRequest = this.shareForm.value;
    
    this.projectSharingService.createShareGrant(this.projectId, shareData).subscribe({
      next: () => {
        this.snackBar.open('Project shared successfully', 'Close', {
          duration: 3000
        });
        this.shareForm.reset({
          permissionLevel: SharePermissionLevel.VIEW_ONLY
        });
        this.loadShares(); // Reload the list
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error sharing project', err);
        this.snackBar.open('Error sharing project. Please try again.', 'Close', {
          duration: 5000
        });
        this.submitting = false;
      }
    });
  }

  /**
   * Update a share grant's permission level
   * @param share The share grant to update
   * @param newPermissionLevel The new permission level
   */
  updateSharePermission(share: ShareGrantResponse, newPermissionLevel: SharePermissionLevel): void {
    const shareData: ShareGrantRequest = {
      email: share.email,
      permissionLevel: newPermissionLevel
    };
    
    this.projectSharingService.updateShareGrant(this.projectId, share.id, shareData).subscribe({
      next: () => {
        this.snackBar.open('Permission updated successfully', 'Close', {
          duration: 3000
        });
        this.loadShares(); // Reload the list
      },
      error: (err) => {
        console.error('Error updating permission', err);
        this.snackBar.open('Error updating permission. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  /**
   * Delete a share grant after confirmation
   * @param share The share grant to delete
   */
  deleteShare(share: ShareGrantResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Remove Share',
        message: `Are you sure you want to remove access for ${share.email}? They will no longer have access to this project.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectSharingService.deleteShareGrant(this.projectId, share.id).subscribe({
          next: () => {
            this.snackBar.open('Share removed successfully', 'Close', {
              duration: 3000
            });
            this.loadShares(); // Reload the list
          },
          error: (err) => {
            console.error('Error removing share', err);
            this.snackBar.open('Error removing share. Please try again.', 'Close', {
              duration: 5000
            });
          }
        });
      }
    });
  }

  /**
   * Get a readable label for a permission level
   * @param level The permission level enum value
   * @returns A readable label
   */
  getPermissionLabel(level: SharePermissionLevel): string {
    switch (level) {
      case SharePermissionLevel.VIEW_ONLY:
        return 'View Only';
      case SharePermissionLevel.CAN_EXECUTE:
        return 'Can Execute';
      case SharePermissionLevel.CAN_EDIT:
        return 'Can Edit';
      default:
        return level;
    }
  }
}

