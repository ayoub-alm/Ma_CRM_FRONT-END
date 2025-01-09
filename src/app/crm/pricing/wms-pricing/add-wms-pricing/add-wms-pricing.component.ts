import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-add-wms-pricing',
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    NgIf,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    AsyncPipe,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    PaginatorModule,
    ReactiveFormsModule,
    MatInput
  ],
  templateUrl: './add-wms-pricing.component.html',
  styleUrl: './add-wms-pricing.component.css'
})
export class AddWmsPricingComponent {

}
