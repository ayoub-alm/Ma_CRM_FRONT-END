import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {BehaviorSubject, catchError, combineLatest, filter, of, Subject, takeUntil, tap} from 'rxjs';
import {ProvisionResponseDto} from '../../../../../dtos/response/crm/provision.response.dto';
import {SupportResponseDto} from '../../../../../dtos/response/crm/support.response.dto';
import {StructureResponseDto} from '../../../../../dtos/response/crm/structure.response.dto';
import {TemperatureResponseDto} from '../../../../../dtos/response/crm/temperature.response.dto';
import {StorageNeedService} from '../../../../../services/crm/wms/storage.need.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SupportService} from '../../../../../services/crm/wms/support.service';
import {StructureService} from '../../../../../services/crm/wms/structure.service';
import {TemperatureService} from '../../../../../services/crm/wms/temperature.service';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';
import {StockedItemCreateDto} from '../../../../../dtos/request/crm/stockedItem.create.dto';
import {StorageOfferService} from '../../../../../services/crm/wms/storage.offer.service';

@Component({
  selector: 'app-add-stocked-item',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    PaginatorModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSlideToggle,
    MatTable,
    MatHeaderCellDef
  ],
  templateUrl: './add-stocked-item.component.html',
  styleUrl: './add-stocked-item.component.css'
})
export class AddStockedItemComponent implements OnInit , OnDestroy {
  private destroy$ = new Subject<void>();
  itemToStoreFormGroup!: FormGroup;
  provisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  selectedProvisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  provisionsDisplayedColumns: string[] = ['name',"unite"];

  supports: BehaviorSubject<SupportResponseDto[]> = new BehaviorSubject<SupportResponseDto[]>([]);
  structures: BehaviorSubject<StructureResponseDto[]> = new BehaviorSubject<StructureResponseDto[]>([]);
  temperatures: BehaviorSubject<TemperatureResponseDto[]> = new BehaviorSubject<TemperatureResponseDto[]>([]);
  itemsToStore: BehaviorSubject<StockedItemCreateDto> =  new BehaviorSubject<StockedItemCreateDto>({} as StockedItemCreateDto )
  constructor(@Inject(MAT_DIALOG_DATA) public data:any ,private matDialogRef: MatDialogRef<AddStockedItemComponent>, private storageNeedService: StorageNeedService,
              public router: Router,private activeRouter: ActivatedRoute, private snackBar: MatSnackBar, private fb: FormBuilder,private supportService: SupportService, private structureService: StructureService,
              private temperatureServices: TemperatureService, private localStorageService: LocalStorageService, private provisionService: ProvisionService,
              private storageOfferService: StorageOfferService ) {
  }

  ngOnInit() {
    this.initializeItemToStoreForm();
    this.loadTemperatures();
    this.loadSupport();
    this.loadStructures();
    this.loadProvisions();
    this.fileDimensionsBySelectedSupport();
  }

  initializeItemToStoreForm(): void {
    this.itemToStoreFormGroup = this.fb.group({
      supportId: ['', Validators.required],
      structureId: [''],
      temperatureId: ['', Validators.required],
      width: ['', [Validators.min(0)]],
      length: ['', [Validators.min(0)]],
      height: ['', [Validators.min(0)]],
      weight: ['', [Validators.min(0)]],
      isFragile: [''],
      StackabilityLevels: [0, [Validators.min(0)]],
      volume: ['', [Validators.min(0)]],
      quantity: ['', [Validators.min(0)]],
      uvc: ['', [Validators.min(0)]],
      uc: ['', [Validators.min(0)]],
      provisions: [[], Validators.required],
    });

    this.itemToStoreFormGroup.get("provisions")?.valueChanges.pipe(
      tap((selectedProvisionIds: number[]) => {
        // Filter provisions based on selected IDs
        const  filteredProvisions = this.provisions.getValue()
          .filter(provision => selectedProvisionIds.includes(provision.id));
        this.selectedProvisions.next(filteredProvisions);
      }),
      catchError(err => {
        console.error('Error processing provisions value changes:', err);
        return of([]); // Return an empty array on error
      })
    ).subscribe();
  }

  /**
   *
   */
  loadProvisions(): void{
    this.provisionService.getAllProvisionsByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(data => {
        this.provisions.next(data); // Perform the side effect of updating provisions
      }),
      catchError(err => {
        console.error(err); // Log the error
        return of([]); // Return an empty array in case of an error
      })
    ).subscribe();
  }

  /**
   * this function allows to load support
   */
  loadSupport(): void{
    this.supportService.getAllSupportsByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap((response: SupportResponseDto[])=>{
        this.supports.next(response);
      }),
      catchError((err) => {
        console.error(err);
        return of(null);
      })
    ).subscribe()
  }

  /**
   * this function allows to load structures by company ID
   */
  loadStructures(): void{
    this.structureService.getAllStructuresByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap((response: StructureResponseDto[])=>{
        this.structures.next(response);
      }),
      catchError((err) => {
        console.error(err);
        return of(null);
      })
    ).subscribe()
  }

  /**
   * this function allows to load structures by company ID
   */
  loadTemperatures(): void{
    this.temperatureServices.getAllTemperaturesByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap((response: TemperatureResponseDto[])=>{
        this.temperatures.next(response);
      }),
      catchError((err) => {
        console.error(err);
        return of(null);
      })
    ).subscribe()
  }

  /**
   *
   */
  fileDimensionsBySelectedSupport():void{
    this.itemToStoreFormGroup.get('supportId')?.valueChanges
      .pipe(
        filter(Boolean), // Ensures supportId is not null/undefined
        tap(supportId => {
          const selectedSupport = this.supports.value.find(support => support.id === supportId);
          if (selectedSupport) {
            const { width, length, height } = selectedSupport.dimension;
            this.itemToStoreFormGroup.patchValue({
              width: width,
              length: length,
              height: height,
              volume: ((width / 100) * (length / 100) * (height / 100)).toFixed(3) // Ensuring precision
            });
          }
        }),).subscribe();

    combineLatest([
      this.itemToStoreFormGroup.get('width')!.valueChanges,
      this.itemToStoreFormGroup.get('length')!.valueChanges,
      this.itemToStoreFormGroup.get('height')!.valueChanges
    ])
      .pipe(
        tap(([width, length, height]) => {
          if (width && length && height) {
            this.itemToStoreFormGroup.patchValue({
              volume: ((width / 100) * (length / 100) * (height / 100)).toFixed(3)
            }, { emitEvent: false }); // Avoid infinite loop
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   *
   */
  createNewStockedItem() {
    this.itemToStoreFormGroup.markAllAsTouched();

      const item: StockedItemCreateDto = this.itemToStoreFormGroup.value;
    console.log(item);
    item.provisions = this.selectedProvisions.getValue();
      const storageNeedId = this.data.storageNeedId; // Assuming storageNeedId is passed via dialog data
      if (storageNeedId != null){
        this.storageNeedService.addStockedItemToStorageNeed(storageNeedId, item)
          .subscribe({
            next: (response) => {
              this.snackBar.open('Stocked item added successfully!', 'Close', { duration: 3000 });
              this.matDialogRef.close(response);
            },
            error: (error) => {
              console.error('Error adding stocked item:', error);
              this.snackBar.open('Failed to add stocked item. Please try again.', 'Close', { duration: 3000 });
            }
          });
      } else {
        const storageOfferId = this.data.storageOfferId;
        this.storageOfferService.addStockedItemToStorageOffer(storageOfferId, item)
          .subscribe({
            next: (response) => {
              this.snackBar.open('Stocked item added successfully!', 'Close', { duration: 3000 });
              this.matDialogRef.close(response);
            },
            error: (error) => {
              console.error('Error adding stocked item:', error);
              this.snackBar.open('Failed to add stocked item. Please try again.', 'Close', { duration: 3000 });
            }
          });
      }

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
