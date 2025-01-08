import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  signal, viewChild, ViewChild
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {InteractionResponseDto} from '../../../../../dtos/response/interaction.response.dto';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatSelect} from '@angular/material/select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelActionRow,
  MatExpansionPanelHeader
} from '@angular/material/expansion';
import {BehaviorSubject, catchError, map, of, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../../../dtos/response/crm/unloading.type.response.dto';
import {UnloadingTypeService} from '../../../../../services/crm/wms/unloading.type.service';
import {IndexComponent} from '../../../../index/index.component';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {CommonModule} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {StockedItemCreateDto} from '../../../../../dtos/request/crm/stockedItem.create.dto';
import NewCommandModule from '@angular/cli/src/commands/new/cli';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';
import {ProvisionResponseDto} from '../../../../../dtos/response/crm/provision.response.dto';

@Component({
  selector: 'app-wms-need-creat-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatOption,
    MatLabel,
    MatFormField,
    MatGridTile,
    MatSelect,
    ReactiveFormsModule,
    MatInput,
    MatIcon,
    MatIconButton,
    MatDatepickerToggle,
    MatDatepicker,
    MatGridList, MatDatepickerModule,
    MatDatepicker, MatButton, MatExpansionPanelActionRow, MatExpansionPanelHeader, MatExpansionPanel, MatAccordion,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule, MatTable, MatColumnDef, MatHeaderCell, MatCell, MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatHeaderRow, MatRow, MatRowDef, MatMenu, MatMenuItem, MatMenuTrigger,
  ],
  templateUrl: './wms-need-creat-edit.component.html',
  styleUrl: './wms-need-creat-edit.component.css',
  providers: [provideNativeDateAdapter()],
})
export class WmsNeedCreatEditComponent implements OnInit, AfterViewInit {
  generalInfoFormGroup!: FormGroup;
  itemToStoreFormGroup!: FormGroup;
  unloadForm!: FormGroup;
  provisionForm!: FormGroup;
  managementFeesForm!: FormGroup;
  insuranceForm!: FormGroup;


  itemsToStore: BehaviorSubject<StockedItemCreateDto[]> =  new BehaviorSubject<StockedItemCreateDto[]>([])
  itemsToStoredisplayedColumns: string[] = [
    'conditionnement',
    'structure',
    'temperatureStockage',
    'largeur',
    'hauteur',
    'actions'
  ];
  // unloading type infos
  unloadingTypes: BehaviorSubject<UnloadingTypeResponseDto[]> =  new BehaviorSubject<UnloadingTypeResponseDto[]>([])
  selectedUnloadingTypes:  BehaviorSubject<UnloadingTypeResponseDto[]> =  new BehaviorSubject<UnloadingTypeResponseDto[]>([])
  unloadingDisplayedColumns: string[] = [ 'name', "price","unite", "actions"];
  unloadingDataSource: BehaviorSubject<UnloadingTypeResponseDto[]> = new BehaviorSubject<UnloadingTypeResponseDto[]>([]);
  // provisions infos
  provisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  selectedProvisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  provisionsDisplayedColumns: string[] = [ 'name', "price","unite", "actions"];
  readonly panelOpenState = signal(false);
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  accordion = viewChild.required(MatAccordion);
  constructor(private fb: FormBuilder,private cdr: ChangeDetectorRef, private unloadingTypeService: UnloadingTypeService,
              private localStorageService: LocalStorageService, private provisionService: ProvisionService) {}

  ngOnInit(): void {
    this.initializeGeneralInfoForm()
    this.initializeItemToStoreForm()
    this.initializeUnloadForm()
    this.initializeProvisionForm()
    this.initializeManagementFeesForm()
    this.initializeInsuranceForm()
    this.generalInfoFormGroup.get('livre')?.setValue("Ouvert")

    this.loadProvisions()
    this.loadUnloadingTypes()
  }

  /**
   *
   */
  ngAfterViewInit(): void {
    this.generalInfoFormGroup.get('livre')?.setValue("Ouvert")
  }

  /**
   *
   */
  initializeGeneralInfoForm(): void{
     this.generalInfoFormGroup = this.fb.group({
       statut: ['', Validators.required],
       dateReception: [ new Date(), Validators.required],
       entreprise: ['', Validators.required],
       interlocuteurs: ['', Validators.required],
       typeProduits: ['', Validators.required],
       dureeStockage: [12, [Validators.required, Validators.min(1)]],
       nombreSku: ['', Validators.required],
       raisonStockage: ['', Validators.required],
       livre: ['', Validators.required],
       tauxCommandes: ['', [Validators.required, Validators.min(0)]],
     });
  }

  initializeItemToStoreForm(): void {
    this.itemToStoreFormGroup = this.fb.group({
      conditionnement: ['', Validators.required],
      structure: [''],
      temperatureStockage: ['', Validators.required],
      largeur: ['', [Validators.min(0)]],
      longueur: ['', [Validators.min(0)]],
      hauteur: ['', [Validators.min(0)]],
      hauteurMax: ['', [Validators.min(0)]],
      poids: ['', [Validators.min(0)]],
      metreCubeMax: ['', [Validators.min(0)]],
      niveauxGerbabilite: [0, [Validators.required, Validators.min(0)]],
      volumeStock: ['', [Validators.min(0)]],
      nombreUvc: ['', [Validators.min(0)]],
    });
  }

  /**
   *
   */
  initializeUnloadForm():void {
    this.unloadForm = this.fb.group({
      unload: [[], Validators.required],
    })

    this.unloadForm.get("unload")?.valueChanges.pipe(
      map((data: any[]) => {
        return this.unloadingTypes.getValue().filter(unloadType => data.includes(unloadType.id));
      })
    ).subscribe(filteredUnloadingTypes => {
      this.selectedUnloadingTypes.next(filteredUnloadingTypes);
      this.unloadingDataSource.next(filteredUnloadingTypes);
    });
  }

  /**
   *
   */
  initializeProvisionForm(){
    this.provisionForm = this.fb.group({
      provision: [[], Validators.required],
    })

    this.provisionForm.get("provision")?.valueChanges.pipe(
      map((data: any[]) => {
        return this.provisions.getValue().filter(provision => data.includes(provision.id));
      })
    ).subscribe(filteredProvisions => {
      this.selectedProvisions.next(filteredProvisions);
      // this.unloadingDataSource.next(filteredProvisions);
    });
  }

  initializeManagementFeesForm():void {
    this.managementFeesForm = this.fb.group({
      fees: [[], ]
    })
  }

  initializeInsuranceForm(): void{
    this.insuranceForm = this.fb.group({
      insurance: [[],],
    })
  }

  addItemToItemToStore() {
    if (this.itemToStoreFormGroup.valid) {
      // Extract the form values
      const item: StockedItemCreateDto = this.itemToStoreFormGroup.value;
      this.itemsToStore.next([...this.itemsToStore.getValue(), item]);
      // Pass the DTO to your desired service or processing logic
      console.log('New Item to Store:', item);

      // Call your service or processing logic here
      // Example: this.itemToStoreService.create(item).subscribe(...);
    } else {
      console.error('Form is invalid. Please check the required fields.');
    }
  }


  loadProvisions(): void {
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

  loadUnloadingTypes(): void{
    // get unloading types and fill the select box by pushing data in unloading variable
    this.unloadingTypeService.getUnloadingTypeByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(unloadingTypes => {
        this.unloadingTypes.next(unloadingTypes)
      })
    ).subscribe()
  }
}
