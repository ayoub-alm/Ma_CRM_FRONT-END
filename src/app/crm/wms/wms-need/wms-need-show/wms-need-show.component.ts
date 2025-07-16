import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {StorageNeedService} from '../../../../../services/crm/wms/storage.need.service';
import {BehaviorSubject, catchError, EMPTY, map, of, tap, throwError} from 'rxjs';
import {StorageNeedResponseDto} from '../../../../../dtos/response/crm/storage.need.response.dto';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
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
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';

import {getLabelFromStorageReasonEnum} from '../../../../../enums/crm/storage.reason.enum';
import {CommentComponent} from '../../../../utils/comment/comment.component';
import {EntityEnum} from '../../../../../enums/entity.enum';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatOption, MatRipple} from '@angular/material/core';
import {ProvisionResponseDto} from '../../../../../dtos/response/crm/provision.response.dto';
import {SupportService} from '../../../../../services/crm/wms/support.service';
import {StructureService} from '../../../../../services/crm/wms/structure.service';
import {TemperatureService} from '../../../../../services/crm/wms/temperature.service';
import {SupportResponseDto} from '../../../../../dtos/response/crm/support.response.dto';
import {StructureResponseDto} from '../../../../../dtos/response/crm/structure.response.dto';
import {TemperatureResponseDto} from '../../../../../dtos/response/crm/temperature.response.dto';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {StockedItemCreateDto} from '../../../../../dtos/request/crm/stockedItem.create.dto';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';
import {MatDialog} from '@angular/material/dialog';
import {AddStockedItemComponent} from '../add-stocked-item/add-stocked-item.component';
import {StockedItemResponseDto} from '../../../../../dtos/response/crm/stocked.itemresponse.dto';
import {PrintService} from '../../../../../services/docs/print.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {RequirementResponseDto} from '../../../../../dtos/response/crm/requirement.response.dto';
import {RequirementService} from '../../../../../services/crm/wms/requirement.service';
import {UnloadingTypeResponseDto} from '../../../../../dtos/response/crm/unloading.type.response.dto';
import {UnloadingTypeService} from '../../../../../services/crm/wms/unloading.type.service';
import {TrackingLogComponent} from '../../../../utils/tracking-log/tracking-log.component';
import {MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {GeneralInfosComponent} from '../../../../utils/general-infos/general-infos.component';
import {LivreEnum} from '../../../../../enums/crm/livre.enum';
import {StorageOfferService} from '../../../../../services/crm/wms/storage.offer.service';

@Component({
  selector: 'app-wms-need-show',
  standalone: true,
  imports: [
    MatButton, MatCard, MatCardContent, MatIcon, MatBottomSheetModule, NgIf, NgForOf,
    DatePipe, MatMenu, MatMenuItem, MatMenuTrigger, FormsModule, MatCell, MatCellDef, MatColumnDef
    ,MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatIconButton, MatRow, MatRowDef, MatTable, ReactiveFormsModule,
    MatHeaderCellDef, NgClass, AsyncPipe, MatFormField, MatLabel, MatOption, MatSelect, GeneralInfosComponent
  ],
  templateUrl: './wms-need-show.component.html',
  styleUrl: './wms-need-show.component.css'
})
export class WmsNeedShowComponent implements OnInit, AfterViewInit{
  storageNeed:BehaviorSubject<StorageNeedResponseDto> = new BehaviorSubject<StorageNeedResponseDto>({} as StorageNeedResponseDto);
  expandedElement: any | null = null;
  itemsToStoredisplayedColumns: string[] = [
    'conditionnement',
    'structure',
    'temperatureStockage',
    'largeur',
    'hauteur',
    'provisions',
    'actions',
  ];

  itemToStoreFormGroup!: FormGroup;
  provisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  selectedProvisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  provisionsDisplayedColumns: string[] = [ 'name',"unite", "actions"];
  unloadingDataSource: BehaviorSubject<UnloadingTypeResponseDto[]> = new BehaviorSubject<UnloadingTypeResponseDto[]>([]);
  unloadingTypes: BehaviorSubject<UnloadingTypeResponseDto[]> =  new BehaviorSubject<UnloadingTypeResponseDto[]>([])
  supports: BehaviorSubject<SupportResponseDto[]> = new BehaviorSubject<SupportResponseDto[]>([]);
  structures: BehaviorSubject<StructureResponseDto[]> = new BehaviorSubject<StructureResponseDto[]>([]);
  temperatures: BehaviorSubject<TemperatureResponseDto[]> = new BehaviorSubject<TemperatureResponseDto[]>([]);
  isAddNewItemToStoreOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAddNewProvision: boolean = false;
  requirementForm!: FormGroup;
  unloadForm!: FormGroup;
  requirements: BehaviorSubject<RequirementResponseDto[]> =  new BehaviorSubject<RequirementResponseDto[]>([])
  constructor(private storageNeedService: StorageNeedService, public router: Router,private activeRouter: ActivatedRoute,
              private snackBar: MatSnackBar, private fb: FormBuilder,private supportService: SupportService, private structureService: StructureService,
              private temperatureServices: TemperatureService, private localStorageService: LocalStorageService, private provisionService: ProvisionService,
              private dialog: MatDialog, private printService: PrintService, private requirementService: RequirementService,
              private unloadingTypeService: UnloadingTypeService, private storageOfferService: StorageOfferService) {
  }

  ngOnInit() {
    const storageNeedId:number = this.activeRouter.snapshot.params['id'];
    this.loadStorageNeed(storageNeedId)
    this.initializeItemToStoreForm();
    this.loadTemperatures();
    this.loadSupport();
    this.loadStructures();
    this.loadProvisions();
    this.initializeRequirementForm()
    this.loadRequirements()
    this.initializeUnloadForm()
    this.loadUnloadingTypes();
  }

  /**
   *
   * @param storageNeedId
   */
  loadStorageNeed(storageNeedId: number): void {
    this.storageNeedService.getStorageNeedById(storageNeedId).pipe(
      tap(data => this.storageNeed.next(data)),
      catchError((err) => {
        this.snackBar.open("Erreur de téléchargement de données", "ok", {duration: 3000})
        return of(null);}
      )).subscribe({
      next:()=> {
        console.log(this.storageNeed.getValue());
      }
    })
  }


  ngAfterViewInit() {
    this.unloadForm.get("unload")?.setValue(
      this.storageNeed.getValue().unloadingTypes.map(unloadType => { return unloadType.id}))

    this.requirementForm.get("requirement")?.setValue(
      this.storageNeed.getValue().requirements.map(requirement => { return requirement.id}));
  }

  toggleRow(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  getNeedStatus(status: string): string {
    switch (status){
      case 'CREATION':
        return "Crée"
      default:
        return "N/A"
    }
  }

  initializeRequirementForm() {
    this.requirementForm = this.fb.group({
      requirement: [[]],
    });

    this.requirementForm.get("requirement")?.valueChanges.pipe(
      tap((selectedIds: number[]) => {
        const storageNeed = this.storageNeed.getValue();

        // Filtrer les requirements sélectionnés
        const selectedRequirements = this.requirements.getValue().filter(req => selectedIds.includes(req.id));

        // Vérifier si l'utilisateur ajoute ou supprime un élément
        selectedRequirements.forEach(selectedReq => {
          const exists = storageNeed.requirements.some(req => req.id === selectedReq.id);

          if (!exists) {
            this.storageNeedService.addRequirement(storageNeed.id, selectedReq.id).subscribe(updatedStorageNeed => {
              this.storageNeed.next(updatedStorageNeed);
              this.snackBar.open('Exigence ajouté avec succès.', 'OK', { duration: 3000 });
            });
          }
        });

        // Supprimer les requirements désélectionnés
        storageNeed.requirements.forEach(existingReq => {
          if (!selectedIds.includes(existingReq.id)) {
            this.storageNeedService.removeRequirement(storageNeed.id, existingReq.id).subscribe(() => {
              const updatedRequirements = storageNeed.requirements.filter(req => req.id !== existingReq.id);
              this.storageNeed.getValue().requirements = updatedRequirements;
              this.snackBar.open('Exigence supprimé.', 'OK', { duration: 3000 });
            });
          }
        });
      })
    ).subscribe();
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
  loadUnloadingTypes(): void{
    // get unloading types and fill the select box by pushing data in unloading variable
    this.unloadingTypeService.getUnloadingTypeByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(unloadingTypes => {
        this.unloadingTypes.next(unloadingTypes)
      })
    ).subscribe()
  }

  initializeUnloadForm():void {
    this.unloadForm = this.fb.group({
      unload: [[]],
    })

    this.unloadForm.get("unload")?.valueChanges.pipe(
      tap((selectedIds: number[]) => {
        const storageNeed = this.storageNeed.getValue();

        // Filtrer les unloading types sélectionnés
        const selectedUnloadingTypes = this.unloadingTypes.getValue().filter(unloadType => selectedIds.includes(unloadType.id));

        // Vérifier si l'utilisateur ajoute ou supprime un élément
        selectedUnloadingTypes.forEach(selectedType => {
          const exists = storageNeed.unloadingTypes.some(type => type.id === selectedType.id);

          if (!exists) {
            // Ajouter le nouvel unloading type
            this.storageNeedService.addUnloadingType(storageNeed.id, selectedType.id).subscribe(updatedStorageNeed => {
              this.storageNeed.next(updatedStorageNeed);
              this.unloadingDataSource.next(updatedStorageNeed.unloadingTypes);
              this.snackBar.open('Déchargement  ajouté avec succès.', 'OK', { duration: 3000 });
            });
          }
        });

        // Supprimer les unloading types désélectionnés
        storageNeed.unloadingTypes.forEach(existingType => {
          if (!selectedIds.includes(existingType.id)) {
            this.storageNeedService.removeUnloadingType(storageNeed.id, existingType.id).subscribe(() => {
              const updatedUnloadingTypes = storageNeed.unloadingTypes.filter(type => type.id !== existingType.id);
              this.storageNeed.getValue().unloadingTypes = updatedUnloadingTypes;
              this.unloadingDataSource.next(updatedUnloadingTypes);
              this.snackBar.open('Déchargement supprimé.', 'OK', { duration: 3000 });
            });
          }
        });
      })
    ).subscribe()




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


  addItemToItemToStore() {
    if (this.itemToStoreFormGroup.valid) {
      // Extract the form values
      const item: StockedItemCreateDto = this.itemToStoreFormGroup.value;
      item.provisions = this.selectedProvisions.getValue().map(provision => new ProvisionResponseDto(provision));
      // this.itemsToStore.next([...this.itemsToStore.getValue(), item]);
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
   * Removes a specific provision from an item's provisions list.
   * @param element - The `StockedItemCreateDto` item from which the provision needs to be removed.
   * @param prov - The `ProvisionResponseDto` provision to remove.
   */
  removeProvision(element: StockedItemResponseDto, prov: ProvisionResponseDto): void {
     this.provisionService.removeProvisionFromStockedItem(element.id, prov.id).pipe(
       tap(data => {
          if (data){
            this.loadStorageNeed(this.storageNeed.getValue().id)
          }else {
            this.snackBar.open("error durrant la supprission ", "OK", {duration:3000});
          }
       })
     ).subscribe()
  }


  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;
  protected readonly EntityEnum = EntityEnum;

  /**
   * this function allows to create storage offer from need
   */
  createOfferFromNeed() {
    this.storageOfferService.createStorageOfferFormNeedId(this.storageNeed.getValue().id)
      .pipe(tap(data => {
        this.snackBar.open("Offer a été bien crée", "OK", {duration:3000})
        this.router.navigateByUrl('/admin/crm/wms/offers/show/'+data.id).then()
      })).subscribe({
      error:(err)=>{
        console.error(err)
        return EMPTY;
      }
    })
    // this.router.navigate(['/admin/crm/wms/offers/create'], {state: {data: this.storageNeed.getValue()}})
    //   .then(() => console.log('Navigation successful'))
    //   .catch(err => console.error('Navigation error:', err));
  }

  onAddNewStockedItem() {
    const dialogRef = this.dialog.open(AddStockedItemComponent,{
      maxWidth: '900px', data:{storageNeedId: this.storageNeed.getValue().id}
    })

    dialogRef.afterClosed().pipe(
      tap((data:StockedItemResponseDto) => {
        if (data){
          this.loadStorageNeed(this.storageNeed.getValue().id);
        }
      })
    ).subscribe()

  }

  private _bottomSheet = inject(MatBottomSheet);



  openBottomSheet(): void {
    this._bottomSheet.open(TrackingLogComponent);
  }


  removeStockedItem(stockedItemId: number) {
    const storageNeedId = this.storageNeed.getValue().id;

    this.storageNeedService.removeStockedItem(storageNeedId, stockedItemId).subscribe({
      next: () => {
        const updatedStockedItems = this.storageNeed.getValue().stockedItems.filter(item => item.id !== stockedItemId);
        this.storageNeed.getValue().stockedItems = updatedStockedItems;
        this.snackBar.open('Article à stocker supprimé avec succès.', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open("Erreur lors de la suppression de l'article à stocker.", 'OK', { duration: 3000 });
        return of(EMPTY);
      }
    });
  }

  /**
   *
   * @param stockedItem
   * @constructor
   */
  UnselectedProvisions(stockedItem: StockedItemResponseDto) {
    return this.provisions.getValue().filter(prv => !stockedItem.provisionResponseDto?.map(prv =>  prv.id).includes(prv.id))
  }

  /**
   * this function allows to add new stocked item to storage need
   * @param element
   * @param event
   */
  addNewProvisionToStockedItem(element: StockedItemResponseDto, event: Event) {
    const inputValue = (event.target as HTMLInputElement)?.value;

    if (!inputValue && inputValue == "") {
      this.snackBar.open("Veuillez entrer une valeur valide", "Ok", { duration: 3000 });
      return;
    }

    this.provisionService.addProvisionToStockedItem(element.id, parseInt(inputValue)).pipe(
      tap(() => {
        const addedProvision = this.provisions.getValue().find(prv => prv.id == parseInt(inputValue));
        if (addedProvision){
          this.storageNeed.getValue().stockedItems.find(item => item.id == element.id)?.provisionResponseDto.push(addedProvision);
        }
        this.snackBar.open("Provision ajoutée avec succès", "Ok", { duration: 3000 });
      }),
      catchError(error => {
        console.error("Erreur lors de l'ajout de la provision:", error);
        this.snackBar.open("Erreur lors de l'ajout de la provision", "Ok", { duration: 3000 });
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * this function allows to soft delete storage Need
   */
  onSoftDeleteStorageNeed() {
    this.storageNeedService.deleteStorageNeed(this.storageNeed.getValue().id).subscribe({
      next: () => {
        this.snackBar.open("le Besoin a été bien supprimé", "Ok", {duration: 3000 });
        this.router.navigateByUrl("/admin/crm/wms/needs");
      },
      error: () => {
        this.snackBar.open("Erreur lors de la suppression", "OK", {duration: 3000 });
      }
    });
  }

  protected readonly LivreEnum = LivreEnum;
}
