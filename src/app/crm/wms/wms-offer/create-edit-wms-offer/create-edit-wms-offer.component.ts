import {AfterViewInit, Component, OnInit, signal, ViewChild} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BehaviorSubject, catchError, map, of, tap} from 'rxjs';
import {ProspectResponseDto} from '../../../../../dtos/response/prospect.response.dto';
import {InterlocutorResDto} from '../../../../../dtos/response/interlocutor.dto';
import {
  mapStockedItemResponseToCreate,
  StockedItemCreateDto
} from '../../../../../dtos/request/crm/stockedItem.create.dto';
import {UnloadingTypeResponseDto} from '../../../../../dtos/response/crm/unloading.type.response.dto';
import {ProvisionResponseDto} from '../../../../../dtos/response/crm/provision.response.dto';
import {RequirementResponseDto} from '../../../../../dtos/response/crm/requirement.response.dto';
import {SupportResponseDto} from '../../../../../dtos/response/crm/support.response.dto';
import {StructureResponseDto} from '../../../../../dtos/response/crm/structure.response.dto';
import {TemperatureResponseDto} from '../../../../../dtos/response/crm/temperature.response.dto';
import {MatExpansionPanel} from '@angular/material/expansion';
import {ActivatedRoute, Router} from '@angular/router';
import {UnloadingTypeService} from '../../../../../services/crm/wms/unloading.type.service';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';
import {RequirementService} from '../../../../../services/crm/wms/requirement.service';
import {StorageNeedService} from '../../../../../services/crm/wms/storage.need.service';
import {ProspectService} from '../../../../../services/Leads/prospect.service';
import {InterlocutorService} from '../../../../../services/Leads/interlocutor.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SupportService} from '../../../../../services/crm/wms/support.service';
import {StructureService} from '../../../../../services/crm/wms/structure.service';
import {TemperatureService} from '../../../../../services/crm/wms/temperature.service';
import {getLabelFromStorageReasonEnum, StorageReasonEnum} from '../../../../../enums/crm/storage.reason.enum';
import {LivreEnum} from '../../../../../enums/crm/livre.enum';
import {StorageNeedResponseDto} from '../../../../../dtos/response/crm/storage.need.response.dto';
import {StockedItemResponseDto} from '../../../../../dtos/response/crm/stocked.itemresponse.dto';
import {DiscountTypeEnum} from '../../../../../enums/discount.type.enum';
import {StorageOfferModel} from '../../../../../models/storage.offer.model';
import {elements} from 'chart.js';
import {StorageOfferCreateDto} from '../../../../../dtos/request/crm/storage.offer.create.dto';
import {StorageOfferService} from '../../../../../services/crm/wms/storage.offer.service';
import {PaymentMethodResponseDto} from '../../../../../dtos/init_data/response/paymentMethodResponseDto';
import {PaymentMethodService} from '../../../../../services/data/payemet.method.service';

@Component({
  selector: 'app-create-edit-wms-offer',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    MatButton,
    MatCard,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatMenu,
    MatMenuItem,
    MatOption,
    MatRow,
    MatRowDef,
    MatSelect,
    MatSuffix,
    MatTable,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatMenuTrigger,
    MatHeaderCellDef,
    MatCardContent,
    NgClass,
    DatePipe
  ],
  templateUrl: './create-edit-wms-offer.component.html',
  styleUrl: './create-edit-wms-offer.component.css',
  providers: [provideNativeDateAdapter()],
})
export class CreateEditWmsOfferComponent implements OnInit, AfterViewInit {
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  interlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  filteredInterlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  generalInfoFormGroup!: FormGroup;
  itemToStoreFormGroup!: FormGroup;
  unloadForm!: FormGroup;
  paymentTypeForm!: FormGroup;
  requirementForm!: FormGroup;
  paymentMethods: BehaviorSubject<PaymentMethodResponseDto[]> = new BehaviorSubject<PaymentMethodResponseDto[]>([]);
  storageNeed: BehaviorSubject<StorageNeedResponseDto> = new BehaviorSubject({} as StorageNeedResponseDto)

  storageReasons: { key: string; value: string }[] = [];
  livreStatuses: { key: string; value: string }[] = [];
  itemsToStore: BehaviorSubject<StockedItemResponseDto[]> =  new BehaviorSubject<StockedItemResponseDto[]>([])
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
  unloadingDisplayedColumns: string[] =  [ 'name', "unite","price", "remise", "remiseValue", "finalPrice", "actions",];
  unloadingDataSource: BehaviorSubject<UnloadingTypeResponseDto[]> = new BehaviorSubject<UnloadingTypeResponseDto[]>([]);
  // provisions infos
  provisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  selectedProvisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  provisionsDisplayedColumns: string[] = [ 'name', "unite","price", "remise", "remiseValue", "finalPrice", "actions",];
  // requirements infos
  requirements: BehaviorSubject<RequirementResponseDto[]> =  new BehaviorSubject<RequirementResponseDto[]>([])
  selectedRequirements: BehaviorSubject<RequirementResponseDto[]> =  new BehaviorSubject<RequirementResponseDto[]>([])
  requirementsColumns: string[] = [ 'name', "unite","price", "remise", "remiseValue", "finalPrice", "actions",];

  supports: BehaviorSubject<SupportResponseDto[]> = new BehaviorSubject<SupportResponseDto[]>([]);
  structures: BehaviorSubject<StructureResponseDto[]> = new BehaviorSubject<StructureResponseDto[]>([]);
  temperatures: BehaviorSubject<TemperatureResponseDto[]> = new BehaviorSubject<TemperatureResponseDto[]>([]);
  expandedElement: any | null = null;
  storageOffer: BehaviorSubject<StorageOfferModel> = new BehaviorSubject<StorageOfferModel>({} as StorageOfferModel);
  readonly panelOpenState = signal(false);
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;
  constructor(private fb: FormBuilder,private router: Router, private unloadingTypeService: UnloadingTypeService,
    private localStorageService: LocalStorageService, private provisionService: ProvisionService,
    private requirementService: RequirementService,private storageNeedService: StorageNeedService,private storageOfferService: StorageOfferService,
    private prospectService: ProspectService, private interlocutorService: InterlocutorService,
    private snackBar: MatSnackBar,private supportService: SupportService, private structureService: StructureService,
    private temperatureServices: TemperatureService, private route: ActivatedRoute, private paymentsMethodsService: PaymentMethodService) {}

  ngOnInit(): void {
    this.initializeGeneralInfoForm()
    this.initializeItemToStoreForm()
    this.initializeUnloadForm()
    this.initializeRequirementForm()
    this.initializePaymentsTypeFrom()
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
    this.loadPaymentMethods();


  }
  /**
   *
   */
  ngAfterViewInit(): void {
    this.generalInfoFormGroup.get('livre')?.setValue("Ouvert")
    // Get data from router state (previous page)
    const storageNeed = history.state.data;
    if (storageNeed) {
      this.fillDataFromInputsWithdataFromNeed(storageNeed);
    } else {
      console.warn('No data found in navigation state');
    }
  }
  /**
   *
   */
  initializeGeneralInfoForm(): void{
    this.generalInfoFormGroup = this.fb.group({
      // statut: ['', Validators.required],
      dateReception: [ new Date(), Validators.required],
      costumer: ['', Validators.required],
      interlocuteurs: [''],
      typeProduits: ['', Validators.required],
      dureeStockage: [12, [Validators.required, Validators.min(1)]],
      nombreSku: ['', Validators.required],
      raisonStockage: ['', Validators.required],
      livre: ['', Validators.required],
      tauxCommandes: ['', [Validators.min(0)]],
    });
  }

  loadPaymentMethods(){
    this.paymentsMethodsService.getAllPaymentMethods().pipe(tap((data)=> {
      this.paymentMethods.next(data)
    })).subscribe()
  }

  initializePaymentsTypeFrom(){
    this.paymentTypeForm = this.fb.group({
      paymentDeadline:["", Validators.required],
      paymentTypeId:["",  Validators.required],
    })
  }

  initializeItemToStoreForm(): void {
    this.itemToStoreFormGroup = this.fb.group({
      supportId: ['', Validators.required],
      structureId: [''],
      temperatureId: ['', Validators.required],
      larger: ['', [Validators.min(0)]],
      length: ['', [Validators.min(0)]],
      height: ['', [Validators.min(0)]],
      weight: ['', [Validators.min(0)]],
      metreCubeMax: ['', [Validators.min(0)]],
      StackabilityLevels: ["", [Validators.min(0)]],
      volumeStock: ['', [Validators.min(0)]],
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
  fillDataFromInputsWithdataFromNeed(storageNeed: StorageNeedResponseDto){
    this.generalInfoFormGroup.get('costumer')?.setValue(storageNeed.customer.id);
    this.generalInfoFormGroup.get('costumer')?.disable();
    this.generalInfoFormGroup.get('dateReception')?.disable();
    this.generalInfoFormGroup.get('interlocuteurs')?.setValue(storageNeed.customer.id);
    this.generalInfoFormGroup.get('interlocuteurs')?.disable();
    this.generalInfoFormGroup.get('typeProduits')?.setValue(storageNeed.productType);
    this.generalInfoFormGroup.get('typeProduits')?.disable();
    this.generalInfoFormGroup.get('dureeStockage')?.setValue(storageNeed.duration);
    this.generalInfoFormGroup.get('dureeStockage')?.disable();
    this.generalInfoFormGroup.get('nombreSku')?.setValue(storageNeed.numberOfSku);
    this.generalInfoFormGroup.get('nombreSku')?.disable();
    this.generalInfoFormGroup.get('tauxCommandes')?.setValue(storageNeed.numberOfSku);
    this.generalInfoFormGroup.get('tauxCommandes')?.disable();
    this.generalInfoFormGroup.get('livre')?.setValue(storageNeed.liverStatus);
    this.generalInfoFormGroup.get('livre')?.disable();
    this.generalInfoFormGroup.get('raisonStockage')?.setValue(storageNeed.storageReason);
    this.generalInfoFormGroup.get('raisonStockage')?.disable();

    this.unloadForm.get('unload')?.setValue(storageNeed.unloadingTypes.map(
      unload => unload.id));

    this.selectedUnloadingTypes.next(storageNeed.unloadingTypes.map((unload) => {
      unload.salesPrice = unload.initPrice
      return unload
    }))

    this.requirementForm.get('requirement')?.setValue(storageNeed.requirements.map(
      requirement => requirement.id));
    this.selectedRequirements.next(storageNeed.requirements.map((req) => {
      req.salesPrice = req.initPrice
      return req
    }))

    console.log(this.selectedRequirements.getValue());
    // set final price like init price
    storageNeed.stockedItems.map(stocked =>
      stocked.provisionResponseDto?.map(prv => prv.salesPrice = prv.initPrice))
    this.itemsToStore.next(storageNeed.stockedItems)

    this.storageNeed.next(storageNeed);
    console.log(this.itemsToStore.getValue());
  }
  /**
   *
   */
  addItemToItemToStore() {
    if (this.itemToStoreFormGroup.valid) {
      // Extract the form values
      const item: StockedItemCreateDto = this.itemToStoreFormGroup.value;
      item.provisions = this.selectedProvisions.getValue().map(provision => new ProvisionResponseDto(provision));
      // this.itemsToStore.next([...this.itemsToStore.getValue(), item]);
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
    const updatedRequirement = this.requirements.getValue().map((requirement) => {
       requirement.salesPrice = requirement.initPrice
      return requirement
    })
    this.requirements.next(updatedRequirement);
  }

  /**
   *
   */
  createStorageOffer(){
    const storageOfferTOCreate = this.createNewOfferRequestDto();
    console.log(storageOfferTOCreate);
    if (storageOfferTOCreate){
      this.storageOfferService.createStorageOffer(storageOfferTOCreate).pipe(
        tap(data => {
          this.snackBar.open("Le offer du client a été bien créé. ✅","OK", {duration:3000})
          this.router.navigateByUrl('/admin/crm/wms/offers').then();
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
  createNewOfferRequestDto(): StorageOfferCreateDto  {
    this.generalInfoFormGroup.markAllAsTouched();
    // this.itemToStoreFormGroup.markAllAsTouched();
    // this.unloadForm.markAllAsTouched();
    // this.requirementForm.markAllAsTouched();

    // Extract data from the form and BehaviorSubjects
    const generalInfo = this.generalInfoFormGroup.value;
    const stockedItems = this.itemsToStore.getValue();
    const unloadingTypes = this.selectedUnloadingTypes.getValue();
    const requirements = this.selectedRequirements.getValue();
    // Create StorageNeedCreateDto
    return new StorageOfferCreateDto(
      this.generateUUID(),
      this.storageNeed.getValue().storageReason,
      generalInfo.statut,
      this.storageNeed.getValue().liverStatus,
      new Date(),
      this.storageNeed.getValue().duration,
      this.storageNeed.getValue().numberOfSku,
      this.storageNeed.getValue().productType,
      this.storageNeed.getValue().customer.id,
      this.localStorageService.getItem("selected_company_id"),
      stockedItems.map(item =>  mapStockedItemResponseToCreate(item)),
      unloadingTypes,
      requirements,
      this.storageNeed.getValue().id,
      this.paymentTypeForm.get('paymentTypeId')?.value,
      this.paymentTypeForm.get('paymentDeadline')?.value,
      this.storageNeed.getValue().interlocutor.id
    );
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
    // const item = this.itemsToStore.getValue().find((item) => item === element);
    // if (item) {
      // Update the provisions list by excluding the one that matches the given provision's ID
      // item.provisions = item.provisions.filter((p) => p.id !== prov.id);
      // Emit the updated list of items to ensure changes are reflected wherever this BehaviorSubject is used
      // this.itemsToStore.next([...this.itemsToStore.getValue()]);
    // }
  }

  /**
   * Removes an item entirely from the `itemsToStore` list.
   * @param element - The `StockedItemCreateDto` item to remove from the BehaviorSubject.
   */
  removeItemToStore(element: StockedItemCreateDto): void {
    // Get the current list of items and filter out the element to remove
    // const updatedItems = this.itemsToStore.getValue().filter((itemToStore) => itemToStore !== element);
    // Emit the updated list of items to ensure changes are reflected wherever this BehaviorSubject is used
    // this.itemsToStore.next(updatedItems);
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

  protected readonly DiscountTypeEnum = DiscountTypeEnum;

  /**
   *
   * @param item
   * @param prv
   * @param event
   */
  selectDiscountTypeForProvision(item: StockedItemResponseDto, prv: ProvisionResponseDto, event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value as keyof typeof DiscountTypeEnum;

    if (selectedValue === DiscountTypeEnum.NOTAPPLICABLE) {
      prv.salesPrice = prv.initPrice;
    }

    if (DiscountTypeEnum[selectedValue]) {
      prv.discountType = DiscountTypeEnum[selectedValue];
    } else {
      console.error(`Invalid discount type: ${selectedValue}`);
    }
  }


  /**
   *
   * @param item
   * @param prv
   * @param $event
   */
  addDiscountValueForProvision(item: StockedItemResponseDto, prv: ProvisionResponseDto, $event: Event) {
    if ($event){
      prv.discountValue =  parseInt(($event.target as HTMLSelectElement).value) ;
      prv.salesPrice = prv.initPrice - prv.discountValue;
    }
  }

  /**
   *
   * @param item
   * @param prv
   * @param $event
   */
  addDiscountRateForProvision(item: StockedItemResponseDto, prv: ProvisionResponseDto, $event: Event) {
    const discountValue = parseFloat(($event.target as HTMLInputElement).value); // Convert input value to a number
    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      prv.salesPrice = prv.initPrice - (prv.initPrice * (discountValue / 100));
    } else {
      prv.salesPrice = prv.initPrice; // Keep original price if invalid input
    }
  }

  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;

  selectDiscountTypeForRequirement(element: RequirementResponseDto, event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value as keyof typeof DiscountTypeEnum;

    const requirement = this.selectedRequirements.getValue().find(
      req => req.id === element.id
    );

    if (selectedValue === DiscountTypeEnum.NOTAPPLICABLE) {
      element.salesPrice = element.initPrice;
    }

    if (requirement) {
      if (DiscountTypeEnum[selectedValue]) {
        requirement.discountType = DiscountTypeEnum[selectedValue];
      } else {
        console.error(`Invalid discount type: ${selectedValue}`);
      }
    }
  }


  addDiscountValueForRequirement(element: RequirementResponseDto, $event: Event) {
    if ($event){
      element.discountValue =  parseInt(($event.target as HTMLSelectElement).value) ;
      element.salesPrice = element.initPrice - element.discountValue;
    }
  }

  protected readonly elements = elements;

  addDiscountRateForRequirement(element: RequirementResponseDto, $event: Event) {
    const discountValue = parseFloat(($event.target as HTMLInputElement).value); // Convert input value to a number
    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      element.salesPrice = element.initPrice - (element.initPrice * (discountValue / 100));
    } else {
      element.salesPrice = element.initPrice; // Keep original price if invalid input
    }
  }

  selectDiscountTypeForUnloading(element: UnloadingTypeResponseDto, event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value as keyof typeof DiscountTypeEnum;

    const unloading = this.selectedUnloadingTypes.getValue().find(
      requirement => requirement.id === element.id
    );

    if (unloading) {
      if (selectedValue === DiscountTypeEnum.NOTAPPLICABLE) {
        element.salesPrice = element.initPrice;
      }

      if (DiscountTypeEnum[selectedValue]) {
        unloading.discountType = DiscountTypeEnum[selectedValue];
      } else {
        console.error(`Invalid discount type: ${selectedValue}`);
      }
    }
  }


  addDiscountValueForUnloading(element: UnloadingTypeResponseDto, $event: Event) {
    if ($event){
      element.discountValue =  parseInt(($event.target as HTMLSelectElement).value) ;
      element.salesPrice = element.initPrice - element.discountValue;
    }
  }

  addDiscountRateForUnloading(element: UnloadingTypeResponseDto, $event: Event) {
    const discountValue = parseFloat(($event.target as HTMLInputElement).value); // Convert input value to a number
    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      element.salesPrice = element.initPrice - (element.initPrice * (discountValue / 100));
    } else {
      element.salesPrice = element.initPrice; // Keep original price if invalid input
    }
  }
}
