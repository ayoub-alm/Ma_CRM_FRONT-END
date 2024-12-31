import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {InteractionResponseDto} from '../../../../../dtos/response/interaction.response.dto';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-wms-need-creat-edit',
  standalone: true,
  imports: [
    MatFormField,
    MatDialogContent,
    MatDialogActions,
    MatInput,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './wms-need-creat-edit.component.html',
  styleUrl: './wms-need-creat-edit.component.css'
})
export class WmsNeedCreatEditComponent {
  constructor(    private dialogRef: MatDialogRef<WmsNeedCreatEditComponent>,
                  @Inject(MAT_DIALOG_DATA) public data: any | null,) {
  }
}
