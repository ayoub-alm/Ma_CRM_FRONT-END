import {Component, Inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BehaviorSubject, catchError, of, tap} from 'rxjs';
import {UniteOfMeasurementResponseDto} from '../../../../../dtos/init_data/response/unite.of.measurement.dto';
import {UnitOfMeasurementsService} from '../../../../../services/data/unit.of.measurements.service';
import {ProvisionResponseDto} from '../../../../../dtos/response/crm/provision.response.dto';
import {ProvisionRequestDto} from '../../../../../dtos/init_data/request/provision.request.dto';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';

@Component({
  selector: 'app-add-edit-provision-dialog',
  standalone: true,
    imports: [
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
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        PaginatorModule,
        ReactiveFormsModule
    ],
  templateUrl: './add-edit-provision-dialog.component.html',
  styleUrl: './add-edit-provision-dialog.component.css'
})
export class AddEditProvisionDialogComponent implements OnInit {
    units: BehaviorSubject<UniteOfMeasurementResponseDto[]> =  new BehaviorSubject<UniteOfMeasurementResponseDto[]>([]);
    provisionForm: FormGroup;
    constructor(private fb: FormBuilder, public dialog: MatDialog,private unitOfMeasurementService: UnitOfMeasurementsService,
                @Inject(MAT_DIALOG_DATA) public data: ProvisionResponseDto, private localStorageService: LocalStorageService,
                private snackBar: MatSnackBar,private dialogRef: MatDialogRef<AddEditProvisionDialogComponent>, private provisionService: ProvisionService) {
      this.provisionForm = this.fb.group({
        name: new FormControl("", [Validators.required]),
        unite: new FormControl("", [Validators.required]),
        initPrice:["", [Validators.required]],
        order: new FormControl("", [Validators.required]),
      })
    }

    ngOnInit() {
      this.unitOfMeasurementService.getAllUnitOfMeasurement().subscribe({
        next:(data: UniteOfMeasurementResponseDto[]) => {
          this.units.next(data);
        }
      })
    }


  /**
   * this function allows to create Provision
   */
  // onCreateProvision():void{
  //   const provision: ProvisionRequestDto =  new ProvisionRequestDto(
  //     this.provisionForm.get('name')?.value,
  //     this.provisionForm.get('initPrice')?.value,
  //     this.provisionForm.get('unite')?.value,
  //     this.provisionForm.get('order')?.value,
  //     parseInt(this.localStorageService.getItem("selected_company_id"))
  //   )
  //   this.provisionService.createProvision(provision).pipe(
  //     tap(provision => {
  //       this.snackBar.open("Préstation créé avec succès","Ok", {duration: 3000,})
  //       this.dialogRef.close(provision)
  //     }),
  //     catchError(error => {
  //       this.snackBar.open("Erreur lors de la création du Préstation","Close", {duration: 3000,})
  //       return of(null)
  //     })
  //   ).subscribe()
  // }

  addNewPricing() {

  }
}
