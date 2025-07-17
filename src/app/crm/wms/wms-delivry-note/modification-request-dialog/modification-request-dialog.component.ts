import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {AsyncPipe, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {StorageDeliveryNoteService} from '../../../../../services/crm/wms/storage.delivery.note.service';
import {catchError, EMPTY, tap} from 'rxjs';

@Component({
  selector: 'app-modification-request-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './modification-request-dialog.component.html',
  styleUrl: './modification-request-dialog.component.css'
})
export class ModificationRequestDialogComponent implements OnInit, AfterViewInit{
    requestForm!: FormGroup;
    constructor(private dialogRef: MatDialogRef<ModificationRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any,
                private fb: FormBuilder, private deliveryNoteService: StorageDeliveryNoteService) {
      this.requestForm = this.fb.group({
        deliveryNoteId:["", Validators.required],
        note:["", Validators.required],
      })
    }

    ngOnInit() {
      this.requestForm.get('deliveryNoteId')?.setValue(this.data.id)
    }

    ngAfterViewInit() {
      this.requestForm.get('deliveryNoteId')?.setValue(this.data.id)
      alert(this.data.id)
    }


  /**
   *
   */
  createUpdateRequest() {
    this.deliveryNoteService.createModificationRequest(this.data.id, this.requestForm.get("note")?.value).pipe(
        tap((data) => {
        this.dialogRef.close(true)
      }),
      catchError(err => {
        this.dialogRef.close(false)
        return EMPTY;
      })
    ).subscribe()
  }
}
