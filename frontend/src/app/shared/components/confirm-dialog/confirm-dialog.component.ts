import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  color?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false
})
export class ConfirmDialogComponent {
  public data: ConfirmDialogData;
  public dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  constructor() {
    const injectedData = inject(MAT_DIALOG_DATA) as ConfirmDialogData;
    const defaults: ConfirmDialogData = {
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      color: 'primary'
    };
    this.data = { ...defaults, ...injectedData };
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
