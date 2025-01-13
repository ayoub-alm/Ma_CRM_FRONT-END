import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

// Interface defining the structure of the data passed to the confirmation dialog
export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  constructor(
      public dialogRef: MatDialogRef<ConfirmationDialogData>,
      @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}

  // Static method to open the dialog
  static open(dialog: MatDialog ,data: ConfirmationDialogData): Promise<boolean> {
    const dialogRef = dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data,
    });
    // The promise resolves to a boolean indicating whether the user confirmed or canceled
    return dialogRef.afterClosed().toPromise();
  }
}
