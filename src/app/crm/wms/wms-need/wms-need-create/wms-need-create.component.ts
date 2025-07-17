import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {PaginatorModule} from 'primeng/paginator';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BehaviorSubject, catchError, of, tap} from 'rxjs';
import {ProspectService} from '../../../../../services/Leads/prospect.service';
import {InterlocutorService} from '../../../../../services/Leads/interlocutor.service';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {InterlocutorResDto} from '../../../../../dtos/response/interlocutor.dto';
import {ProspectResponseDto} from '../../../../../dtos/response/prospect.response.dto';
import {StorageReasonEnum} from '../../../../../enums/crm/storage.reason.enum';
import {LivreEnum} from '../../../../../enums/crm/livre.enum';
import {MatButton} from '@angular/material/button';
import {StorageNeedCreateDto} from '../../../../../dtos/request/crm/storage.need.create.dto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StockedItemCreateDto} from '../../../../../dtos/request/crm/stockedItem.create.dto';
import {UnloadingRequestDto} from '../../../../../dtos/init_data/request/unloading.request.dto';
import {RequirementRequestDto} from '../../../../../dtos/init_data/request/requirment.request.dto';
import {UnloadingTypeResponseDto} from '../../../../../dtos/response/crm/unloading.type.response.dto';
import {RequirementResponseDto} from '../../../../../dtos/response/crm/requirement.response.dto';
import {StorageNeedService} from '../../../../../services/crm/wms/storage.need.service';

@Component({
  selector: 'app-wms-need-create',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    NgForOf,
    PaginatorModule,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './wms-need-create.component.html',
  styleUrl: './wms-need-create.component.css',
  providers: [provideNativeDateAdapter()],
})
export class WmsNeedCreateComponent implements OnInit{
  generalInfoFormGroup!: FormGroup;
  interlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  filteredInterlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  customers:BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  storageReasons: { key: string; value: string }[] = [];
  livreStatuses: { key: string; value: string }[] = [];
  constructor( public dialogRef: MatDialogRef<WmsNeedCreateComponent>,private fb: FormBuilder,private customerService:ProspectService,
                  @Inject(MAT_DIALOG_DATA) public data: Set<number>,private interlocutorService: InterlocutorService,
               private localStorageService: LocalStorageService, private snackBar: MatSnackBar, private storageNeedService: StorageNeedService) {

    this.generalInfoFormGroup = this.fb.group({
      // statut: ['', Validators.required],
      dateReception: [ new Date(), Validators.required],
      costumer: ['', Validators.required],
      interlocutorId: [''],
      typeProduits: ['', Validators.required],
      dureeStockage: [12, [Validators.required, Validators.min(1)]],
      nombreSku: ['', Validators.required],
      raisonStockage: ['', Validators.required],
      livre: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadProspects();
    this.loadInterlocutors();
    this.loadStorageReasons();
    this.loadLivreStatuses();
    this.filterInterlocutorsBySelectedCustomer();
  }



  /**
   * this function allows to get all interlocutors
   */
  loadInterlocutors():void{
    this.interlocutorService.getAllInterlocutorsByCompanyId(this.localStorageService.getCurrentCompanyId()).pipe(
      tap(data => {
        this.interlocutors.next(data);
        this.filteredInterlocutors.next(data)
      }),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    ).subscribe()
  }

  /**
   *
   */
  loadProspects(): void{
    this.customerService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(
      tap(data => this.customers.next(data)),
      catchError(err => {
        console.error(err)
        return of(null)
      })
    ).subscribe()
  }

  /**
   *
   */
  loadStorageReasons(): void {
    this.storageReasons = Object.keys(StorageReasonEnum).map((key) => ({
      key,
      value: StorageReasonEnum[key as keyof typeof StorageReasonEnum],
    }));
  }

  /**
   *
   */
  loadLivreStatuses(): void {
    this.livreStatuses = Object.entries(LivreEnum).map(([key, value]) => ({
      key,
      value,
    }));
  }
  /**
   * this function allows to filter interlocutors based on selected customer
   */
  filterInterlocutorsBySelectedCustomer():void{
    this.generalInfoFormGroup.get('costumer')?.valueChanges.pipe(tap((customerId) => {
      this.filteredInterlocutors.next(
        this.interlocutors.getValue().filter(interlocutor => interlocutor.customer.id === customerId)
      );})).subscribe()
  }

  /**
   *
   */
  createStorageNeed(){
    const storageNeedTOCreate = this.createNewNeedRequestDto();
    if (storageNeedTOCreate){
      this.storageNeedService.createStorageNeed(storageNeedTOCreate).pipe(
        tap(data => {
          this.snackBar.open("Les besoins du client ont été bien créés. ✅","OK", {duration:3000})
        }),
        catchError(err => {
          return of(null)
        })
      ).subscribe({
        next: data => {
          this.dialogRef.close();
        }
      })
    }
  }

  /**
   *
   */
  createNewNeedRequestDto(): StorageNeedCreateDto | void {
    this.generalInfoFormGroup.markAllAsTouched();

    if (!this.generalInfoFormGroup.valid) {
      this.snackBar.open("Les formulaires ne sont pas valide. Veuillez vérifier les champs obligatoires.⛔", "OK", {duration:3000})
      return;
    }else{
      // Extract data from the form and BehaviorSubjects
      const generalInfo = this.generalInfoFormGroup.value;
      const stockedItems: StockedItemCreateDto[] = [];
      const unloadingTypes: UnloadingTypeResponseDto[] =[];
      const requirements: RequirementResponseDto[] = [];
      // Create StorageNeedCreateDto
      const newNeedRequestDto = new StorageNeedCreateDto(
        this.generateUUID(),
        generalInfo.raisonStockage,
        generalInfo.statut,
        generalInfo.livre,
        new Date(),
        generalInfo.dureeStockage,
        generalInfo.nombreSku,
        generalInfo.typeProduits,
        generalInfo.costumer,
        this.localStorageService.getItem("selected_company_id"),
        stockedItems,
        unloadingTypes,
        requirements,
        this.generalInfoFormGroup.get('interlocutorId')?.value
      );

      console.log('New Need Request DTO:', newNeedRequestDto);
      return newNeedRequestDto;
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
