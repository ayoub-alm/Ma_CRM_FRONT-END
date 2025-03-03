import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject, OnDestroy,
  OnInit,
  signal, viewChild, ViewChild
} from '@angular/core';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatSelect} from '@angular/material/select';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelActionRow,
  MatExpansionPanelHeader
} from '@angular/material/expansion';
import {BehaviorSubject, catchError, combineLatest, filter, map, of, Subject, takeUntil, tap} from 'rxjs';
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
import {RequirementResponseDto} from '../../../../../dtos/response/crm/requirement.response.dto';
import {RequirementService} from '../../../../../services/crm/wms/requirement.service';
import {StorageManagementFeesResponseDto} from '../../../../../dtos/response/crm/storage.management.fees.response.dto';
import {StorageManagementFeesService} from '../../../../../services/crm/wms/storage.management.fees.service';
import {StorageNeedService} from '../../../../../services/crm/wms/storage.need.service';
import {StorageReasonEnum} from '../../../../../enums/crm/storage.reason.enum';
import {LivreEnum} from '../../../../../enums/crm/livre.enum';
import {MatCard} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatChip} from '@angular/material/chips';
import {ProspectResponseDto} from '../../../../../dtos/response/prospect.response.dto';
import {ProspectService} from '../../../../../services/Leads/prospect.service';
import {InterlocutorResDto} from '../../../../../dtos/response/interlocutor.dto';
import {InterlocutorService} from '../../../../../services/Leads/interlocutor.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SupportResponseDto} from '../../../../../dtos/response/crm/support.response.dto';
import {SupportService} from '../../../../../services/crm/wms/support.service';
import {StructureResponseDto} from '../../../../../dtos/response/crm/structure.response.dto';
import {StructureService} from '../../../../../services/crm/wms/structure.service';
import {TemperatureResponseDto} from '../../../../../dtos/response/crm/temperature.response.dto';
import {TemperatureService} from '../../../../../services/crm/wms/temperature.service';
import {StorageNeedCreateDto} from '../../../../../dtos/request/crm/storage.need.create.dto';
import {Router} from '@angular/router';
import {CuboidComponent} from './cuboid/cuboid.component';
import {MatSlideToggle} from '@angular/material/slide-toggle';



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
    MatButtonModule, CuboidComponent,
    MatDatepickerModule, MatTable, MatColumnDef, MatHeaderCell, MatCell, MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatHeaderRow, MatRow, MatRowDef, MatMenu, MatMenuItem, MatMenuTrigger, MatCard, MatDivider, FormsModule, MatChip, MatSlideToggle,
  ],
  templateUrl: './wms-need-creat-edit.component.html',
  styleUrl: './wms-need-creat-edit.component.css',
  providers: [provideNativeDateAdapter()],
})
export class WmsNeedCreatEditComponent implements OnInit, AfterViewInit, OnDestroy {
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  interlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  filteredInterlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  generalInfoFormGroup!: FormGroup;
  itemToStoreFormGroup!: FormGroup;
  unloadForm!: FormGroup;
  requirementForm!: FormGroup;

  storageReasons: { key: string; value: string }[] = [];
  livreStatuses: { key: string; value: string }[] = [];
  itemsToStore: BehaviorSubject<StockedItemCreateDto[]> =  new BehaviorSubject<StockedItemCreateDto[]>([])
  itemsToStoredisplayedColumns: string[] = [
    'conditionnement',
    'structure',
    'temperatureStockage',
    'largeur',
    'hauteur',
    'provisions',
    'actions',
  ];
  // unloading type infos
  unloadingTypes: BehaviorSubject<UnloadingTypeResponseDto[]> =  new BehaviorSubject<UnloadingTypeResponseDto[]>([])
  selectedUnloadingTypes:  BehaviorSubject<UnloadingTypeResponseDto[]> =  new BehaviorSubject<UnloadingTypeResponseDto[]>([])
  unloadingDisplayedColumns: string[] = [ 'name',"unite", "actions"];
  unloadingDataSource: BehaviorSubject<UnloadingTypeResponseDto[]> = new BehaviorSubject<UnloadingTypeResponseDto[]>([]);
  // provisions infos
  provisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  selectedProvisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  provisionsDisplayedColumns: string[] = [ 'name',"unite", "actions"];
  // requirements infos
  requirements: BehaviorSubject<RequirementResponseDto[]> =  new BehaviorSubject<RequirementResponseDto[]>([])
  selectedRequirements: BehaviorSubject<RequirementResponseDto[]> =  new BehaviorSubject<RequirementResponseDto[]>([])
  requirementsColumns: string[] = [ 'name', "unite", "actions"];

  supports: BehaviorSubject<SupportResponseDto[]> = new BehaviorSubject<SupportResponseDto[]>([]);
  structures: BehaviorSubject<StructureResponseDto[]> = new BehaviorSubject<StructureResponseDto[]>([]);
  temperatures: BehaviorSubject<TemperatureResponseDto[]> = new BehaviorSubject<TemperatureResponseDto[]>([]);

  cuboidLength = '150px';
  cuboidWidth = '100px';
  cuboidHeight = '80px';
  @ViewChild(CuboidComponent) cuboid!:CuboidComponent;

  private destroy$ = new Subject<void>();
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  constructor(private fb: FormBuilder,private router: Router, private unloadingTypeService: UnloadingTypeService,
              private localStorageService: LocalStorageService, private provisionService: ProvisionService,
              private requirementService: RequirementService,private storageNeedService: StorageNeedService,
              private prospectService: ProspectService, private interlocutorService: InterlocutorService,
              private snackBar: MatSnackBar,private supportService: SupportService, private structureService: StructureService,
              private temperatureServices: TemperatureService) {}

  ngOnInit(): void {
    this.initializeGeneralInfoForm()
    this.initializeItemToStoreForm()
    this.initializeUnloadForm()
    this.initializeRequirementForm()
    this.generalInfoFormGroup.get('livre')?.setValue("Ouvert")

    this.loadProvisions()
    this.loadUnloadingTypes()
    this.loadRequirements()
    this.loadStorageReasons();
    this.loadLivreStatuses();

    this.loadProspects();
    this.loadInterlocutors();
    this.subscribeToCustomFieldChanges();
    this.loadSupport();
    this.loadStructures();
    this.loadTemperatures();

    // Listen to changes in customer field to filter interlocutor field
    this.filterInterlocutorsBySelectedCustomer();
    this.fileDimensionsBySelectedSupport()
  }
  /**
   *
   */
  ngAfterViewInit(): void {
    this.generalInfoFormGroup.get('livre')?.setValue("Ouvert")
    this.cuboid.setCSSVariable('--cuboid-length', '200px');
    this.cuboid.setCSSVariable('--cuboid-width', '150px');
    this.cuboid.setCSSVariable('--cuboid-height', '100px');

  }
  changeCuboidSize() {
    this.cuboid.setCSSVariable('--cuboid-length', '250px');
    this.cuboid.setCSSVariable('--cuboid-width', '120px');
    this.cuboid.setCSSVariable('--cuboid-height', '140px');
  }
  /**
   *
   */
  initializeGeneralInfoForm(): void{
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
       tauxCommandes: ['', [Validators.min(0)]],
     });
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
      StackabilityLevels: ["", [Validators.min(0)]],
      volume: ['', [Validators.min(0)]],
      numberOfUvc: ['', [Validators.min(0)]],
      numberOfUc: ['', [Validators.min(0)]],
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
            this.changeCuboidSize();
          }
        }),
        takeUntil(this.destroy$) // Ensures cleanup on component destroy
      ).subscribe();

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
            this.changeCuboidSize();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
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
  initializeUnloadForm():void {
    this.unloadForm = this.fb.group({
      unload: [[]],
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
  initializeRequirementForm() {
    this.requirementForm = this.fb.group({
      requirement: [[]], // Default as an array
    });

    this.requirementForm.get('requirement')?.valueChanges.pipe(tap((data: any) => {
      const filteredRequirement: RequirementResponseDto[] = this.requirements.getValue()
        .filter(requirement => data.includes(requirement.id));
      this.selectedRequirements.next(filteredRequirement);
    })).subscribe();
  }

  /**
   *
   */
  addItemToItemToStore() {
    if (this.itemToStoreFormGroup.valid) {
      // Extract the form values
      const item: StockedItemCreateDto = this.itemToStoreFormGroup.value;
      item.provisions = this.selectedProvisions.getValue().map(provision => new ProvisionResponseDto(provision));
      this.itemsToStore.next([...this.itemsToStore.getValue(), item]);
      // Pass the DTO to your desired service or processing logic
      console.log('New Item to Store:', item);
      // Reset provisions and clear selectedProvisions
      this.itemToStoreFormGroup.patchValue({ provisions: [] });
      this.selectedProvisions.next([]);
    } else {
      this.itemToStoreFormGroup.markAllAsTouched();
      this.snackBar.open("Le formulaire n'est pas valide. Veuillez vérifier les champs obligatoires.", "Ok",{duration:3000})
    }
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
   *
   */
  loadUnloadingTypes(): void{
    // get unloading types and fill the select box by pushing data in unloading variable
    this.unloadingTypeService.getUnloadingTypeByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(unloadingTypes => {
        this.unloadingTypes.next(unloadingTypes)
      })
    ).subscribe()
  }

  /**
   *
   */
  loadRequirements(){
    this.requirementService.getRequirementsByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(data => {
      this.requirements.next(data);
    })).subscribe()
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
           this.router.navigateByUrl('/admin/crm/wms/needs').then();
         }),
         catchError(err => {
           return of(null)
         })
        ).subscribe()
    }
  }

  /**
   *
   */
  createNewNeedRequestDto(): StorageNeedCreateDto | void {
    this.generalInfoFormGroup.markAllAsTouched();
    this.itemToStoreFormGroup.markAllAsTouched();
    this.unloadForm.markAllAsTouched();
    this.requirementForm.markAllAsTouched();

    if (!this.generalInfoFormGroup.valid || !this.itemToStoreFormGroup.valid) {
      this.snackBar.open("Les formulaires ne sont pas valide. Veuillez vérifier les champs obligatoires.⛔", "OK", {duration:3000})
      return;
    }else{
      // Extract data from the form and BehaviorSubjects
      const generalInfo = this.generalInfoFormGroup.value;
      const stockedItems = this.itemsToStore.getValue();
      const unloadingTypes = this.selectedUnloadingTypes.getValue();
      const requirements = this.selectedRequirements.getValue();
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

  /**
   *
   * @private
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
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
   * Removes a specific provision from an item's provisions list.
   * @param element - The `StockedItemCreateDto` item from which the provision needs to be removed.
   * @param prov - The `ProvisionResponseDto` provision to remove.
   */
  removeProvision(element: StockedItemCreateDto, prov: ProvisionResponseDto): void {
    // Find the specific item in the BehaviorSubject's list
    const item = this.itemsToStore.getValue().find((item) => item === element);
    if (item) {
      // Update the provisions list by excluding the one that matches the given provision's ID
      item.provisions = item.provisions.filter((p) => p.id !== prov.id);
      // Emit the updated list of items to ensure changes are reflected wherever this BehaviorSubject is used
      this.itemsToStore.next([...this.itemsToStore.getValue()]);
    }
  }

  /**
   * Removes an item entirely from the `itemsToStore` list.
   * @param element - The `StockedItemCreateDto` item to remove from the BehaviorSubject.
   */
  removeItemToStore(element: StockedItemCreateDto): void {
    // Get the current list of items and filter out the element to remove
    const updatedItems = this.itemsToStore.getValue().filter((itemToStore) => itemToStore !== element);
    // Emit the updated list of items to ensure changes are reflected wherever this BehaviorSubject is used
    this.itemsToStore.next(updatedItems);
  }

  /**
   * this function allows to load costumers-prospects
   */
  loadProspects(): void{
    this.prospectService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(
      tap(data => this.customers.next(data)),
      catchError(err => {
        console.error(err)
        return of(null)
      })
    ).subscribe()
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
   * this function allows to subscribe to costumer field and filter interlocutors based on selected Costumer
   */
  private subscribeToCustomFieldChanges() {
     this.generalInfoFormGroup.get('entreprise')?.valueChanges.subscribe((value) => {
       this.filteredInterlocutors.next(
         this.interlocutors.getValue().filter(interlocutor => interlocutor.customer.id === value)
       )
     })
  }

  /**
   *
   * @param temperatureId
   */
  getTemperatureById(temperatureId:number): string{
   const tempName =  this.temperatures.getValue()
     .find(temp => temp.id === temperatureId)?.name
    if (tempName === undefined) {
      return "N/A"
    }
    return tempName;
  }

  /**
   *
   * @param structureId
   */
  getStructureById(structureId:number): string{
    const structureName =  this.structures.getValue()
      .find(structure => structure.id === structureId)?.name
    if (structureName === undefined) {
      return "N/A"
    }
    return structureName;
  }

  /**
   *
   * @param supportId
   */
  getSupportById(supportId:number): string{
    const supportName =  this.supports.getValue()
      .find(support => support.id === supportId)?.name
    if (supportName === undefined) {
      return "N/A"
    }
    return supportName;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
