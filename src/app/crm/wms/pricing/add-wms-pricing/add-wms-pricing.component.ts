import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {UnitOfMeasurementsService} from '../../../../../services/data/unit.of.measurements.service';
import {BehaviorSubject, catchError, map, Observable, of, startWith, tap} from 'rxjs';
import {UniteOfMeasurementResponseDto} from '../../../../../dtos/init_data/response/unite.of.measurement.dto';
import {UnloadingTypeService} from '../../../../../services/crm/wms/unloading.type.service';
import {RequirementService} from '../../../../../services/crm/wms/requirement.service';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';
import {UnloadingRequestDto} from '../../../../../dtos/init_data/request/unloading.request.dto';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RequirementRequestDto} from '../../../../../dtos/init_data/request/requirment.request.dto';
import {ProvisionRequestDto} from '../../../../../dtos/init_data/request/provision.request.dto';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';

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
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    PaginatorModule,
    ReactiveFormsModule,
    MatInput,
    MatAutocomplete,
    MatAutocompleteTrigger,
    AsyncPipe
  ],
  templateUrl: './add-wms-pricing.component.html',
  styleUrl: './add-wms-pricing.component.css'
})

export class AddWmsPricingComponent implements OnInit{
  units: BehaviorSubject<UniteOfMeasurementResponseDto[]> =  new BehaviorSubject<UniteOfMeasurementResponseDto[]>([]);
  pricingForm!: FormGroup;
  filteredOptions: Observable<string[]> | undefined;
  constructor(
    private dialogRef: MatDialogRef<AddWmsPricingComponent>,
    private unitOfMeasurementService: UnitOfMeasurementsService,
    @Inject(MAT_DIALOG_DATA) public data:  any ,
    private unloadingTypeService: UnloadingTypeService,
    private requirementService: RequirementService,
    private provisionService: ProvisionService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar
  ) {
    this.pricingForm = this.fb.group({
      id: [""],
      name: [this.data.object?.name, [Validators.required]],
      unite: ["", [Validators.required]],
      initPrice: ["", [Validators.required]],
      order: ["", [Validators.required]],
    });
  }


  ngOnInit() {
    this.unitOfMeasurementService.getAllUnitOfMeasurement().pipe(
      tap(units => this.units.next(units))
    ).subscribe()
    // fill inputs with data
    if (this.data.object){
      this.pricingForm.patchValue(this.data.object)
      this.pricingForm.get('unite')?.setValue(this.data.object.unitOfMeasurement)
    }

    setTimeout(() => {
      this.filteredOptions = this.pricingForm.get('jobTitle')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
      // this.cdRef.detectChanges(); // optionally trigger detection manually
    });
  }


  addNewPricing():void{
    this.pricingForm.markAsTouched()
    if (this.pricingForm.valid) {
      switch (this.data.type) {
        case 'unloading':
          this.createUnloadingType();
          break;
        case 'requirements':
          this.createRequirement();
          break;
        case 'provisions':
          this.createOrUpdateProvision();
          break;
        default:
          this.snackBar.open("Erreur","Close", {duration: 3000,})
      }
    }
  }

  /**
   * create a new unloading type
   */
  createUnloadingType():void{
    const unloadingType: UnloadingRequestDto =  new UnloadingRequestDto(
      this.pricingForm.get('id')?.value,
      this.pricingForm.get('name')?.value,
      this.pricingForm.get('initPrice')?.value,
      this.pricingForm.get('unite')?.value,
      this.pricingForm.get('order')?.value,
      parseInt(this.localStorageService.getItem("selected_company_id"))
    )
    if (!this.data.object.id) {
      this.unloadingTypeService.createUnloadingType(unloadingType).pipe(
        tap(unloadingType => {
          this.snackBar.open("Dépotage créé avec succès", "Ok", {duration: 3000,})
          this.dialogRef.close(unloadingType)
        }),
        catchError(error => {
          this.snackBar.open("Erreur lors de la création du déchargement", "Close", {duration: 3000,})
          return of(null)
        })
      ).subscribe()
    }else{
      this.unloadingTypeService.updateUnloadingType(unloadingType).pipe(
        tap(unloadingType => {
          this.snackBar.open("Dépotage créé avec succès", "Ok", {duration: 3000,})
          this.dialogRef.close(unloadingType)
        }),
        catchError(error => {
          this.snackBar.open("Erreur lors de la création du déchargement", "Close", {duration: 3000,})
          return of(null)
        })
      ).subscribe()
    }
  }

  /**
   * create a new unloading type
   */
  createRequirement():void{
    const requirement: RequirementRequestDto =  new RequirementRequestDto(
      this.pricingForm.get('id')?.value,
      this.pricingForm.get('name')?.value,
      this.pricingForm.get('initPrice')?.value,
      this.pricingForm.get('unite')?.value,
      this.pricingForm.get('order')?.value,
      parseInt(this.localStorageService.getItem("selected_company_id"))
    )
    if(!this.data.object.id) {
      this.requirementService.createRequirement(requirement).pipe(
        tap(requirement => {
          this.snackBar.open("Exigence créé avec succès", "Ok", {duration: 3000,})
          this.dialogRef.close(requirement)
        }),
        catchError(error => {
          this.snackBar.open("Erreur lors de la création du Exigence", "Close", {duration: 3000,})
          return of(null)
        })
      ).subscribe()
    }else{
      this.requirementService.updateRequirement(requirement).pipe(
        tap(requirement => {
          this.snackBar.open("Exigence créé avec succès", "Ok", {duration: 3000,})
          this.dialogRef.close(requirement)
        }),
        catchError(error => {
          this.snackBar.open("Erreur lors de la création du Exigence", "Close", {duration: 3000,})
          return of(null)
        })
      ).subscribe()
    }
  }

  /**
   * this function allows to Create or Update Provision
   */
  createOrUpdateProvision():void{
    const provision: ProvisionRequestDto =  new ProvisionRequestDto(
      this.pricingForm.get('id')?.value,
      this.pricingForm.get('name')?.value,
      this.pricingForm.get('initPrice')?.value,
      this.pricingForm.get('unite')?.value,
      this.pricingForm.get('order')?.value,
      parseInt(this.localStorageService.getItem("selected_company_id"))
    )
   if (this.data.object.id){
     // in case of update provision
     this.provisionService.updateProvision(provision).pipe(
       tap(provision => {
         this.snackBar.open("Préstation Modifié avec succès","Ok", {duration: 3000,})
         this.dialogRef.close(provision)
       }),
       catchError(error => {
         this.snackBar.open("Erreur lors de la modification du Préstation","Fermé", {duration: 3000,})
         return of(null)
       })
     ).subscribe()
   }else {
     // in case of create provision
     this.provisionService.createProvision(provision).pipe(
       tap(provision => {
         this.snackBar.open("Préstation créé avec succès","Ok", {duration: 3000,})
         this.dialogRef.close(provision)
       }),
       catchError(error => {
         this.snackBar.open("Erreur lors de la création du Préstation","Close", {duration: 3000,})
         return of(null)
       })
     ).subscribe()
   }
  }

  /**
   * this function is a filter for unite of measurement input
   * @param value
   * @private
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.units.getValue()
      .filter(option => option.name.toLowerCase().includes(filterValue))
      .map(option => option.name); // preserve original case
  }

}
