import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
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
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  of,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageOfferResponseDto} from '../../../../../dtos/response/crm/storage.offer.response.dto';
import {StorageOfferService} from '../../../../../services/crm/wms/storage.offer.service';
import {EntityEnum} from '../../../../../enums/entity.enum';
import {getLabelFromStorageReasonEnum, StorageReasonEnum} from '../../../../../enums/crm/storage.reason.enum';
import {DiscountTypeEnum} from '../../../../../enums/discount.type.enum';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {PrintService} from '../../../../../services/docs/print.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {GeneralInfosComponent} from '../../../../utils/general-infos/general-infos.component';
import {StorageContractService} from '../../../../../services/crm/wms/storage.contract.service';
import {RequirementResponseDto} from '../../../../../dtos/response/crm/requirement.response.dto';
import {UnloadingTypeResponseDto} from '../../../../../dtos/response/crm/unloading.type.response.dto';
import {StockedItemResponseDto} from '../../../../../dtos/response/crm/stocked.itemresponse.dto';
import {ProvisionResponseDto} from '../../../../../dtos/response/crm/provision.response.dto';
import {StockedItemProvisionService} from '../../../../../services/crm/wms/stocked.item.provision.service';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {StockedItemProvision} from '../../../../../models/stocked.item.provision.dto';
import {AddStockedItemComponent} from '../../wms-need/add-stocked-item/add-stocked-item.component';
import {MatDialog} from '@angular/material/dialog';
import {MatTooltip} from '@angular/material/tooltip';
import {UnloadingTypeService} from '../../../../../services/crm/wms/unloading.type.service';
import {RequirementService} from '../../../../../services/crm/wms/requirement.service';
import {LivreEnum} from '../../../../../enums/crm/livre.enum';
import {
  CreateStorageContractDialogComponent
} from '../../../../utils/create-storage-contract-dailog/create-storage-contract-dailog.component';
import {PaymentMethodResponseDto} from '../../../../../dtos/init_data/response/paymentMethodResponseDto';

@Component({
  selector: 'app-wms-offer-show',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    NgIf,
    MatCellDef,
    MatColumnDef, MatSelect,
    MatTable, MatFormFieldModule,
    NgForOf, MatLabel, MatIconButton, MatSidenavModule,
    DatePipe, MatMenu, MatMenuItem, MatMenuTrigger, ReactiveFormsModule, GeneralInfosComponent, MatFormField,
    MatOption, MatInput, MatAutocompleteTrigger, MatAutocomplete, MatTooltip, MatSelect, AsyncPipe,
  ],
  templateUrl: './wms-offer-show.component.html',
  styleUrl: './wms-offer-show.component.css'
})
export class WmsOfferShowComponent  implements OnInit, AfterViewInit{
  protected readonly EntityEnum = EntityEnum;
  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;
  protected readonly DiscountTypeEnum = DiscountTypeEnum;
  requirementsColumns: string[] = [ 'name', "unite","price","system_price", "remise", "remiseValue","increaseValue",
    "finalPrice", "delete"];
  storageOffer:BehaviorSubject<StorageOfferResponseDto> = new BehaviorSubject<StorageOfferResponseDto>({} as StorageOfferResponseDto);
  isDisabledEditing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  provisions: BehaviorSubject<ProvisionResponseDto[]> = new BehaviorSubject<ProvisionResponseDto[]>([])
  unloadingDisplayedColumns: string[] =  [ 'name', "unite","price","system_price", "remise", "remiseValue",
    "increaseValue","finalPrice", "delete"];


  @ViewChild('input') input!: ElementRef<HTMLInputElement> ;
  @ViewChild('input2') input2!: ElementRef<HTMLInputElement> ;
  myControl = new FormControl('');
  addNewUnloadingControl = new FormControl('');
  filteredOptions!: ProvisionResponseDto[];
  filteredUnloadingTypes: BehaviorSubject<UnloadingTypeResponseDto[]> = new BehaviorSubject<UnloadingTypeResponseDto[]>([]);
  unloadForm!: FormGroup;
  unloadingTypes: BehaviorSubject<UnloadingTypeResponseDto[]> = new BehaviorSubject<UnloadingTypeResponseDto[]>([]);
  requirementForm!: FormGroup;
  requirements: BehaviorSubject<RequirementResponseDto[]> = new BehaviorSubject<RequirementResponseDto[]>([]);
  storageOfferForm!:FormGroup;
  constructor(private storageOfferService: StorageOfferService, public router: Router,private activeRouter: ActivatedRoute,
              private snackBar: MatSnackBar, private docService: PrintService, private storageContractService: StorageContractService
              ,private stockedItemProvisionService: StockedItemProvisionService, private provisionService: ProvisionService,
              private localStorageService: LocalStorageService, private dialog: MatDialog, private unloadingTypeService: UnloadingTypeService,
              private fb: FormBuilder, private requirementService: RequirementService) {
  }

  ngOnInit() {
    this.loadStorageOffer();
    this.loadProvisions();

    this.initializeUnloadForm();
    this.loadUnloadingTypes();

    this.loadRequirements();
    this.initializeRequirementForm();

    this.addNewUnloadingControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.filterUnloading())
    ).subscribe();

  }

  ngAfterViewInit() {
    this.initializeStorageOfferForm();
    if (this.storageOffer.getValue()) {
      this.storageOfferForm.patchValue(this.storageOffer.getValue());
    }
        this.unloadForm.get("unload")?.setValue(
        this.storageOffer.getValue().unloadingTypes.map(unloadType => { return unloadType.id}));

      this.requirementForm.get("requirement")?.setValue(
        this.storageOffer.getValue().requirements.map(requirement => { return requirement.id}));
    }



  /**
   * this function allows to loadStorage need by id
   */
  loadStorageOffer():void{
    const storageNeedId:number = this.activeRouter.snapshot.params['id'];
    this.storageOfferService.getStorageOfferById(storageNeedId).pipe(
      tap(data => {
        this.storageOffer.next(data)
        this.storageOfferForm.patchValue(data);
      }),
      catchError((err) => {
        this.snackBar.open("Erreur de téléchargement de données", "ok", {duration: 3000})
        return of(null);}
      )).subscribe({
      next:()=> {
      }
    })
  }





  /**
   * this function allows to load provisions
   */

  loadProvisions():void{
    this.provisionService.getAllProvisionsByCompanyId(this.localStorageService.getCurrentCompanyId()).pipe(tap(data => {
      this.provisions.next(data);
    })).subscribe()
  }




  initializeStorageOfferForm(): void {
    this.storageOfferForm = this.fb.group({
      id: [this.storageOffer.getValue().id],
      // ref: [''],
      liverStatus: [this.storageOffer.getValue().liverStatus],
      storageReason: [this.storageOffer.getValue().storageReason],
      status: [],
      expirationDate: [this.storageOffer.getValue().expirationDate],
      duration: [this.storageOffer.getValue().duration],
      numberOfSku: [this.storageOffer.getValue().numberOfSku],
      productType: [this.storageOffer.getValue().productType],
      paymentType: this.fb.group({
        id: [null],
        method: ['']
      }),
      paymentDeadline: [this.storageOffer.getValue().paymentDeadline],
      note: [this.storageOffer.getValue().note],
      numberOfReservedPlaces: [this.storageOffer.getValue().numberOfReservedPlaces],
      managementFees: [this.storageOffer.getValue().managementFees],
      minimumBillingGuaranteed: [this.storageOffer.getValue().minimumBillingGuaranteedFixed],
      maxDisCountValue: [this.storageOffer.getValue().maxDisCountValue],
      devise: [this.storageOffer.getValue().devise],
    });


    /** listen to changes in management fees and update with API **/
    this.storageOfferForm.get("managementFees")?.valueChanges.pipe(
      debounceTime(500), // Prevent excessive API calls
      distinctUntilChanged(),
    ).subscribe(data => {
      if (data != 0 && data != "" && data != this.storageOffer.getValue().managementFees){
        this.storageOfferService.updateManagementFees(this.storageOffer.getValue().id, data).subscribe({
          next:(storageOffer:StorageOfferResponseDto)=> {
            this.storageOffer.next(storageOffer);
          },
          error:(err)=>{
             this.snackBar.open("Erreur lors de la mise à jour", "Ok", {duration:3000})
          }
        });
      }
    })
    /** listen to changes in max discount Value  **/
    this.storageOfferForm.get("maxDisCountValue")?.valueChanges.pipe(
      debounceTime(500), // Prevent excessive API calls
      distinctUntilChanged(),
    ).subscribe(data => {
      if (data != 0 && data != "" && data != this.storageOffer.getValue().managementFees){
        this.storageOfferService.updateMaxDiscountValue(this.storageOffer.getValue().id, data).subscribe({
          next:(storageOffer:StorageOfferResponseDto)=> {
            this.storageOffer.next(storageOffer);
          },
          error:(err)=>{
             this.snackBar.open("Erreur lors de la mise à jour", "Ok", {duration:3000})
          }
        });
      }
    })

    /** listen to changes for note  and update with API **/
    this.storageOfferForm.get("note")?.valueChanges.pipe(
      debounceTime(500), // Prevent excessive API calls
      distinctUntilChanged(),
    ).subscribe(data => {
      if (data != 0 && data != "" && data != this.storageOffer.getValue().note){
        this.storageOfferService.updateNote(this.storageOffer.getValue().id, data).subscribe({
          next:(storageOffer:StorageOfferResponseDto)=> {
            this.storageOffer.next(storageOffer);
          },
          error:(err)=>{
            this.snackBar.open("Erreur lors de la mise à jour", "Ok", {duration:3000})
          }
        });
      }
    })

    /** listen to changes for devise and update with API **/
    this.storageOfferForm.get("devise")?.valueChanges.pipe(
      debounceTime(500), // Prevent excessive API calls
      distinctUntilChanged(),
    ).subscribe(data => {
      if (data != 0 && data != "" && data != this.storageOffer.getValue().note){
        this.storageOfferService.updateDevise(this.storageOffer.getValue().id, data).subscribe({
          next:(storageOffer:StorageOfferResponseDto)=> {
            this.storageOffer.next(storageOffer);
          },
          error:(err)=>{
            this.snackBar.open("Erreur lors de la mise à jour", "Ok", {duration:3000})
          }
        });
      }
    })

  }

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
  initializeUnloadForm():void {
    this.unloadForm = this.fb.group({
      unload: [[]],
    })

    // this.unloadForm.get("unload")?.setValue(this.storageOffer.getValue().unloadingTypes.map(unload => unload.id));
    this.unloadForm.get("unload")?.valueChanges.pipe(
      tap((selectedIds: number[]) => {
        const storageOffer = this.storageOffer.getValue();

        // Filtrer les unloading types sélectionnés
        const selectedUnloadingTypes = this.unloadingTypes.getValue().filter(unloadType => selectedIds.includes(unloadType.id));

        // Vérifier si l'utilisateur ajoute ou supprime un élément
        selectedUnloadingTypes.forEach(selectedType => {
          const exists = storageOffer.unloadingTypes.some(type => type.id === selectedType.id);

          if (!exists) {
            // Ajouter le nouvel unloading type
            this.storageOfferService.addUnloadingType(storageOffer.id, selectedType.id).subscribe({
              next:  updatedStorageOffer => {
                this.storageOffer.next(updatedStorageOffer);
                this.snackBar.open('Déchargement  ajouté avec succès.', 'OK', { duration: 3000 });
              }
            });
          }
        });

        // Supprimer les unloading types désélectionnés
        storageOffer.unloadingTypes.forEach(existingType => {
          if (!selectedIds.includes(existingType.id)) {
            this.storageOfferService.removeUnloadingType(storageOffer.id, existingType.id).subscribe(() => {
              this.storageOffer.getValue().unloadingTypes = storageOffer.unloadingTypes.filter(type => type.id !== existingType.id);
              // this.unloadingDataSource.next(updatedUnloadingTypes);
              this.snackBar.open('Déchargement supprimé.', 'OK', { duration: 3000 });
            });
          }
        });
      })
    ).subscribe()
  }




  /**
   *
   */
  initializeRequirementForm() {
    this.requirementForm = this.fb.group({
      requirement: [[]],
    });

    this.requirementForm.get("requirement")?.valueChanges.pipe(
      tap((selectedIds: number[]) => {
        const storageOffer = this.storageOffer.getValue();

        // Filtrer les requirements sélectionnés
        const selectedRequirements = this.requirements.getValue().filter(req => selectedIds.includes(req.id));

        // Vérifier si l'utilisateur ajoute ou supprime un élément
        selectedRequirements.forEach(selectedReq => {
          const exists = storageOffer.requirements.some(req => req.id === selectedReq.id);

          if (!exists) {
            this.storageOfferService.addRequirementToStorageOffer(storageOffer.id, selectedReq.id).subscribe(updatedStorageNeed => {
              this.storageOffer.next(updatedStorageNeed);
              this.snackBar.open('Exigence ajouté avec succès.', 'OK', { duration: 3000 });
            });
          }
        });

        // Supprimer les requirements désélectionnés
        storageOffer.requirements.forEach(existingReq => {
          if (!selectedIds.includes(existingReq.id)) {
            this.storageOfferService.removeRequirement(storageOffer.id, existingReq.id).subscribe(() => {
              const updatedRequirements = storageOffer.requirements.filter(req => req.id !== existingReq.id);
              this.storageOffer.getValue().requirements = updatedRequirements;
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
  downloadOfferDoc() {
    this.docService.downloadStorageOfferDoc(this.storageOffer.getValue().ref)
  }

  /**
   * This function allows the creation of a storage contract by providing an offer ID.
   */
  createStorageContractFromOffer() {
    const offerId = this.storageOffer.getValue()?.id;

    if (!offerId) {
      this.snackBar.open("Aucun ID d'offre disponible", "Ok", { duration: 3000 });
      return;
    }

    this.storageContractService.checkIfCustomerHasActiveContract(this.storageOffer.getValue().customer.id).subscribe({
      next: (hasActiveContract) => {
        if (hasActiveContract){
          const dialogRef = this.dialog.open(CreateStorageContractDialogComponent, {
            data: {
              title: 'Un contrat existe déjà',
              message: 'Ce client a déjà un contrat actif. Souhaitez-vous créer un nouveau contrat ou un annexe au contrat existant ?',
              confirmText: 'Nouveau contrat',
              cancelText: 'Créer un annexe',
              confirmButtonColor: 'primary',
              hasActiveContract:true,
              customerId:this.storageOffer.getValue().customer.id,
              offerId:this.storageOffer.getValue().id
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              // in cas of create new contract
              this.storageContractService.createStorageContractFromOffer(offerId).pipe(
                tap(storageContract => {
                  this.snackBar.open("Contrat créé avec succès", "Ok", { duration: 3000 });
                  this.router.navigate([`/admin/crm/wms/contracts/show/${storageContract.id}`])
                    .then(() => console.log('Navigation successful'))
                    .catch(err => console.error('Navigation error:', err));
                }),
                catchError(error => {
                  console.error("Error creating contract:", error);
                  this.snackBar.open("Erreur lors de la création du contrat", "Ok", { duration: 3000 });
                  return throwError(() => error);
                })
              ).subscribe();
            }else{
              // in case of create annexe
              alert("should select contract for annexe ")
            }
          })
        }else{
          this.storageContractService.createStorageContractFromOffer(offerId).pipe(
            tap(storageContract => {
              this.snackBar.open("Contrat créé avec succès", "Ok", { duration: 3000 });
              this.router.navigate([`/admin/crm/wms/contracts/show/${storageContract.id}`])
                .then(() => console.log('Navigation successful'))
                .catch(err => console.error('Navigation error:', err));
            }),
            catchError(error => {
              console.error("Error creating contract:", error);
              this.snackBar.open("Erreur lors de la création du contrat", "Ok", { duration: 3000 });
              return throwError(() => error);
            })
          ).subscribe();
        }
      }
    })


  }

  sendForValidation(): void {
    const id = this.storageOffer.getValue().id;
    this.storageOfferService.sendOfferToValidationById(id).subscribe({
      next: (updatedOffer) => {
        this.storageOffer.next(updatedOffer);
        this.snackBar.open("L'offre a été envoyée pour validation", "OK", { duration: 3000 });
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open("Erreur lors de l'envoi pour validation: " + error.message, "OK", { duration: 3000 });
      }
    });
  }

  validateOffer(): void {
    const id = this.storageOffer.getValue().id;
    this.storageOfferService.validateOfferById(id).subscribe({
      next: (updatedOffer) => {
        this.storageOffer.next(updatedOffer);
        this.snackBar.open("L'offre a été validée", "OK", { duration: 3000 });
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open("Erreur lors de la validation: " + error.message, "OK", { duration: 3000 });
      }
    });
  }

  sendOffer(): void {
    const id = this.storageOffer.getValue().id;
    this.storageOfferService.sendOfferById(id).subscribe({
      next: (updatedOffer) => {
        this.storageOffer.next(updatedOffer);
        this.snackBar.open("L'offre a été envoyée", "OK", { duration: 3000 });
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open("Erreur lors de l'envoi: " + error.message, "OK", { duration: 3000 });
      }
    });
  }

  acceptOffer(): void {
    const id = this.storageOffer.getValue().id;
    this.storageOfferService.acceptOfferById(id).subscribe({
      next: (updatedOffer) => {
        this.storageOffer.next(updatedOffer);
        this.snackBar.open("L'offre a été acceptée", "OK", { duration: 3000 });
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open("Erreur lors de l'acceptation: " + error.message, "OK", { duration: 3000 });
      }
    });
  }

  refuseOffer(): void {
    const id = this.storageOffer.getValue().id;
    this.storageOfferService.refuseOfferById(id).subscribe({
      next: (updatedOffer) => {
        this.storageOffer.next(updatedOffer);
        this.snackBar.open("L'offre a été refusée", "OK", { duration: 3000 });
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open("Erreur lors du refus: " + error.message, "OK", { duration: 3000 });
      }
    });
  }


  toggleEditing(): void{
    this.isDisabledEditing.next( !this.isDisabledEditing.getValue())
  }

  selectDiscountTypeForRequirement(element: RequirementResponseDto, event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value as keyof typeof DiscountTypeEnum;

    const requirement = this.storageOffer.getValue().requirements.find(
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
      // update the stocked item provision in back-end
      this.updateStockedItemProvision(prv.stockedItemProvisionId,{
        discountType: DiscountTypeEnum[selectedValue],
        discountValue: prv.discountValue,
        increaseValue: prv.increaseValue,
        initPrice: prv.initPrice,
        provision: prv,
        ref: '',
        salesPrice: prv.salesPrice,
        stockedItem: item,
        stockedItemId: item.id
      })
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
    const value = parseFloat(($event.target as HTMLInputElement).value);
    const maxDiscountPercent = this.storageOffer.getValue().maxDisCountValue ?? 0;
    const maxDiscountAmount = (prv.initPrice * maxDiscountPercent) / 100;

    if (value > maxDiscountAmount) {
      this.snackBar.open(`La remise dépasse ${maxDiscountPercent}% autorisée (${maxDiscountAmount.toFixed(2)} MAD max).`, 'OK', { duration: 3000 });
      return;
    }

    prv.discountValue = value;
    prv.salesPrice = prv.initPrice - value;

      // update the stocked item provision in back-end
      this.updateStockedItemProvision(prv.stockedItemProvisionId,{
        discountType: prv.discountType,
        discountValue: prv.discountValue,
        increaseValue: prv.increaseValue,
        initPrice: prv.initPrice,
        provision: prv,
        ref: '',
        salesPrice: prv.salesPrice,
        stockedItem: item,
        stockedItemId: item.id
      })
  }
  /**
   *
   * @param item
   * @param prv
   * @param $event
   */
  addDiscountRateForProvision(item: StockedItemResponseDto, prv: ProvisionResponseDto, $event: Event) {
    const discountValue = parseFloat(($event.target as HTMLInputElement).value);
    const maxDiscount = this.storageOffer.getValue().maxDisCountValue ?? 0;

    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      if (discountValue > maxDiscount) {
        this.snackBar.open(`Le pourcentage de remise ne peut pas dépasser ${maxDiscount}%`, 'OK', { duration: 3000 });
        return;
      }
      prv.discountValue = discountValue;
      prv.salesPrice = prv.initPrice - (prv.initPrice * (discountValue / 100));
      this.updateStockedItemProvision(prv.stockedItemProvisionId,{
        discountType: prv.discountType,
        discountValue: prv.discountValue,
        increaseValue: prv.increaseValue,
        initPrice: prv.initPrice,
        provision: prv,
        ref: '',
        salesPrice: prv.salesPrice,
        stockedItem: item,
        stockedItemId: item.id
      })
    }else {
      prv.salesPrice = prv.initPrice; // Keep original price if invalid input
    }
  }
  addIncreaseValueForProvision(prv: ProvisionResponseDto,item: StockedItemResponseDto, $event: Event) {
    const increaseValue = parseFloat(($event.target as HTMLInputElement).value); // Convert input value to a number
    if (!isNaN(increaseValue)) {
      prv.increaseValue = increaseValue;
      prv.salesPrice += increaseValue;
      // update the stocked item provision in back-end
      this.updateStockedItemProvision(prv.stockedItemProvisionId,{
        discountType: prv.discountType,
        discountValue: prv.discountValue,
        increaseValue: increaseValue,
        initPrice: prv.initPrice,
        provision: prv,
        ref: '',
        salesPrice: prv.salesPrice,
        stockedItem: item,
        stockedItemId: item.id
      })
    }
  }
  updateStockedItemProvision(stockedItemProvisionId: number, stockedItemProvision: StockedItemProvision): void{
    this.stockedItemProvisionService.update(stockedItemProvisionId, stockedItemProvision, stockedItemProvision.stockedItemId ).subscribe({
      next:() => {
        this.snackBar.open("Prestation modifier avec succès", "ok",{duration:3000});
        this.loadStorageOffer();
      },
      error:(error)=>{
        if(error.status != 200){
          this.snackBar.open("Error lors de modification", "ok",{duration:3000});
          console.error(error)
        }
      }
    })
  }

  addDiscountValueForRequirement(element: RequirementResponseDto, $event: Event) {
    const value = parseFloat(($event.target as HTMLInputElement).value);
    const maxDiscountPercent = this.storageOffer.getValue().maxDisCountValue ?? 0;
    const maxDiscountAmount = (element.initPrice * maxDiscountPercent) / 100;

    if (value > maxDiscountAmount) {
      this.snackBar.open(`La remise dépasse ${maxDiscountPercent}% autorisée (${maxDiscountAmount.toFixed(2)} MAD max).`, 'OK', { duration: 3000 });
      return;
    }

    element.discountValue = value;
    element.salesPrice = element.initPrice - value;
    this.updateStorageOfferRequirement(element);
  }
  addDiscountRateForRequirement(element: RequirementResponseDto, $event: Event) {
    const discountValue = parseFloat(($event.target as HTMLInputElement).value);
    const maxDiscount = this.storageOffer.getValue().maxDisCountValue ?? 0;

    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      if (discountValue > maxDiscount) {
        this.snackBar.open(`Le pourcentage de remise ne peut pas dépasser ${maxDiscount}%`, 'OK', { duration: 3000 });
        return;
      }

      element.discountValue = discountValue;
      element.salesPrice = element.initPrice - (element.initPrice * (discountValue / 100));
      this.updateStorageOfferRequirement(element);
    } else {
      element.salesPrice = element.initPrice;
    }
  }
  addIncreaseValueForRequirement(element:RequirementResponseDto, $event: Event) {
    const increaseValue = parseFloat(($event.target as HTMLInputElement).value);
    element.increaseValue = increaseValue;
    element.salesPrice += increaseValue;
    this.updateStorageOfferRequirement(element);
  }
  updateStorageOfferRequirement(element: RequirementResponseDto) {
    this.storageOfferService.updateStorageOfferRequirement(element.id, element).pipe(
      tap(isUpdated => {
        if (isUpdated) {
          this.snackBar.open('Exigence à été bien modifier ', 'ok', {duration: 3000});
          this.loadStorageOffer();
        }else {
          this.snackBar.open(`Error lors de modification `, 'ok', {duration:3000});
        }
      }),
      catchError(err => {
        this.snackBar.open(`Error lors de modification ${err.message} `, 'ok', {duration:3000});
        return EMPTY;
      })
    ).subscribe()
  }

  selectDiscountTypeForUnloading(element: UnloadingTypeResponseDto, event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value as keyof typeof DiscountTypeEnum;

    const unloading = this.storageOffer.getValue().unloadingTypes.find(
      unload => unload.id === element.id
    );

    if (unloading) {
      if (selectedValue === DiscountTypeEnum.NOTAPPLICABLE) {
        element.salesPrice = element.initPrice;
        this.updateStorageOfferUnloadType(element);
      }

      if (DiscountTypeEnum[selectedValue]) {
        unloading.discountType = DiscountTypeEnum[selectedValue];
        this.updateStorageOfferUnloadType(element);
      } else {
        console.error(`Invalid discount type: ${selectedValue}`);
      }
    }
  }
  addDiscountValueForUnloading(element: UnloadingTypeResponseDto, $event: Event) {
    const value = parseFloat(($event.target as HTMLInputElement).value);
    const maxDiscountPercent = this.storageOffer.getValue().maxDisCountValue ?? 0;
    const maxDiscountAmount = (element.initPrice * maxDiscountPercent) / 100;

    if (value > maxDiscountAmount) {
      this.snackBar.open(`La remise dépasse ${maxDiscountPercent}% autorisée (${maxDiscountAmount.toFixed(2)} MAD max).`, 'OK', { duration: 3000 });
      return;
    }

    element.discountValue = value;
    element.salesPrice = element.initPrice - value;
    this.updateStorageOfferUnloadType(element);
  }
  addDiscountRateForUnloading(element: UnloadingTypeResponseDto, $event: Event) {
    const discountValue = parseFloat(($event.target as HTMLInputElement).value);
    const maxDiscount = this.storageOffer.getValue().maxDisCountValue ?? 0;

    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      if (discountValue > maxDiscount) {
        this.snackBar.open(`Le pourcentage de remise ne peut pas dépasser ${maxDiscount}%`, 'OK', { duration: 3000 });
        return;
      }

      element.discountValue = discountValue;
      element.salesPrice = element.initPrice - (element.initPrice * (discountValue / 100));
      this.updateStorageOfferUnloadType(element);
    } else {
      element.salesPrice = element.initPrice;
      this.updateStorageOfferUnloadType(element);
    }
  }
  addIncreaseValueForUnloadingType(element:UnloadingTypeResponseDto, $event: Event) {
    const increaseValue = parseFloat(($event.target as HTMLInputElement).value);
    element.increaseValue = increaseValue;
    element.salesPrice += increaseValue;
    this.updateStorageOfferUnloadType(element);
  }
  updateStorageOfferUnloadType(element: UnloadingTypeResponseDto): void{
    this.storageOfferService.updateStorageOfferUnloadingType(element.storageOfferUnloadTypeId, element).pipe(
      tap(isUpdated => {
        if (isUpdated) {
          this.snackBar.open('Dépatage à été bien modifier ', 'ok', {duration: 3000});
          this.loadStorageOffer();
        }else {
          this.snackBar.open(`Error lors de modification `, 'ok', {duration:3000});
        }
      }),
      catchError(err => {
        this.snackBar.open(`Error lors de modification ${err.message} `, 'ok', {duration:3000});
        return EMPTY;
      })
    ).subscribe();
  }

  /**
   * delete provision from stocked item
   * @param prv
   * @param item
   */
  deleteProvision(prv:ProvisionResponseDto, item: StockedItemResponseDto ):void{
    this.stockedItemProvisionService.delete(prv.stockedItemProvisionId).pipe(tap(data => {
      this.snackBar.open("préstastion a été bien supprimé", "OK", {duration:3000})
      this.loadStorageOffer()
    })).subscribe();
  }


  filter(item: StockedItemResponseDto): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.provisions.getValue().filter(provision =>
      !item.provisionResponseDto.map(provision => provision.id).includes(provision.id))
      .filter(o => o.name.toLowerCase().includes(filterValue));
  }

  filterUnloading(): void {
    const filterValue = this.input2.nativeElement.value.toLowerCase();

    const selectedUnloadingIds = this.storageOffer.getValue().unloadingTypes.map(unload => unload.id);

    this.filteredUnloadingTypes.next(this.unloadingTypes.getValue()
      .filter(unload => !selectedUnloadingIds.includes(unload.id))
      .filter(unload => unload.name.toLowerCase().includes(filterValue)));
    console.log(filterValue);
    console.log(this.filteredUnloadingTypes.getValue());
  }


  addProvisionToStockedItem(prv: ProvisionResponseDto, item: StockedItemResponseDto) {
    const stockedItemProvison: StockedItemProvision = {
      discountType: DiscountTypeEnum.NOTAPPLICABLE,
      discountValue: 0,
      increaseValue: 0,
      initPrice: prv.initPrice,
      provision: prv,
      ref: '',
      salesPrice: prv.salesPrice,
      stockedItem: item,
      stockedItemId: item.id
    };
    this.stockedItemProvisionService.create(stockedItemProvison).pipe(tap(data => {
      this.snackBar.open("La prestation a été  bien ajouté", "OK", {duration:3000})
      this.myControl.reset()
      this.loadStorageOffer();
    })).subscribe()
  }


  /**
   * this function allows to open add new stocked item and refresh data after add a new item
   */
  onAddNewStockedItem() {
    const dialogRef = this.dialog.open(AddStockedItemComponent,{
      maxWidth: '900px', data:{
        storageOfferId: this.storageOffer.getValue().id,
        storageNeedId: null
      }
    })

    dialogRef.afterClosed().pipe(
      tap((data:StockedItemResponseDto) => {
        if (data){
          this.loadStorageOffer()
        }
      })
    ).subscribe()

  }

  /**
   * this function allows to deleted stocked item from storage offer
   * @param stockedItemId the id if stocked item to deleted
   */
  deleteItemToStoreFromStorageOffer(stockedItemId: number) {
    this.storageOfferService.deleteStockedItemFromOffer(this.storageOffer.getValue().id, stockedItemId).subscribe({
      next:(data)=> {
              this.snackBar.open("Support supprimé avec success", "OK", {duration:3000});
          this.loadStorageOffer();

      },
      error: error => {
        this.snackBar.open(error.message, 'OK', {duration:3000});
      }
    })
  }

  getNumberOfReservedPlaces(): number {
    let numberOfPlaces = 0;
    this.storageOffer.getValue().stockedItems.forEach(item => {
      numberOfPlaces += item.quantity;
    });
    return  Math.round(numberOfPlaces * 0.2);
  }

  protected readonly LivreEnum = LivreEnum;


  updateSelectPaymentMethod(method: PaymentMethodResponseDto) {
      this.storageOfferService.updateSelectedPaymentMethod(this.storageOffer.getValue().id, method.id)
        .pipe(tap(data => {
          this.storageOffer.next(data)
          this.snackBar.open("La method à été bien séléctionner ", "OK", {duration:3000})
        }))
        .subscribe({
          error: err => {
            this.snackBar.open("Erreur lors de la mise à jour", "Ok", {duration:3000})
          }
        })
  }

  calculateStoragePrice(item: any): number {
    const input: StorageInput = {
      raisonDeStockage: this.storageOffer.getValue().storageReason,
      structure: item.structureName,
      metreCubeEstime: item.volume,
      // volumeStockEstime: 0 || 0,
      poidsEstime: item.weight,
      valeursRA: [item.ra1, item.ra2, item.ra3, item.ra4, item.ra5, item.ra6], // make sure they exist or default to 0
      pu: item.initPrice || 0,
      reductionAugmentation: item.reductionMultiplier || 1,
    };

    return calculatePrice(input).finalPrice;
  }

  updateMinimalBilling($event: Event) {
    const input = $event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    alert(value)
    if (!isNaN(value)) {
      this.storageOfferService.updateMinimalBillingAmount(this.storageOffer.getValue().id,value).subscribe((data) => {
        this.snackBar.open("Facturation minimale assurée à éte mis à jour avec succès", "ok", {duration:3000})
      });
    }
  }

  /**
   * This function change the value of resrved places
   * @param $event
   */
  updateReservedPlaces($event: Event) {
    const input = $event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    alert(value)
    if (!isNaN(value)) {
      this.storageOfferService.updateReservedPlaces(this.storageOffer.getValue().id,value).subscribe((data) => {
        this.snackBar.open("number des places résérvé à éte mis à jour avec succès", "ok", {duration:3000})
      });
    }
  }

  OnDeleteUnloadingFromOffer(element: UnloadingTypeResponseDto) {
    this.storageOfferService.removeUnloadingType(this.storageOffer.getValue().id, element.id)
      .pipe(tap(data => {
        this.snackBar.open('Déchargement Supprimé avec succès.', 'OK', { duration: 3000 });
        this.loadStorageOffer();
      }))
      .subscribe();
  }

  addNewUnloadingType(unloadingType: UnloadingTypeResponseDto): void {
    this.addNewUnloadingControl.setValue(unloadingType.name)
    this.storageOfferService.addUnloadingType(this.storageOffer.getValue().id, unloadingType.id).subscribe({
      next:  updatedStorageOffer => {
        this.storageOffer.next(updatedStorageOffer);
        this.snackBar.open('Déchargement  ajouté avec succès.', 'OK', { duration: 3000 });
        this.addNewUnloadingControl.reset();
      }
    });
  }

  OnDeleteRequirementFromOffer(element: RequirementResponseDto) {
    this.storageOfferService.removeRequirement(this.storageOffer.getValue().id, element.id)
      .pipe(tap(data => {
        this.snackBar.open('Exigence supprimé.', 'OK', { duration: 3000 });
        this.loadStorageOffer();
      })).subscribe();
  }

}

// src/app/utils/price-calculator.util.ts
export interface StorageInput {
  raisonDeStockage: string;
  structure: string;
  metreCubeEstime: number;
  // volumeStockEstime: number;
  poidsEstime: number;
  valeursRA: number[]; // RA1 to RA6
  pu: number;
  reductionAugmentation: number;
}

const trancheMultiplierMap: Record<string, number> = {
  'TRANCHE -3': 0.62,
  'TRANCHE -2': 0.25,
  'TRANCHE -1': 0.87,
  'TRANCHE 0': 1.00,
  'TRANCHE +1': 1.13,
  'TRANCHE +2': 1.25,
  'TRANCHE +3': 1.38,
  'TRANCHE +4': 1.50,
};

function getTrancheLabel(score: number): string {
  const capped = Math.max(-3, Math.min(4, score));
  return `TRANCHE ${capped >= 0 ? '+' : ''}${capped}`;
}

export function calculatePrice(input: StorageInput): {
  trancheScore: number;
  trancheLabel: string;
  averageRA: number;
  finalPrice: number;
} {
  let trancheScore = 0;

  if (input.raisonDeStockage === 'Externalisation') trancheScore += -1;
  if (input.structure === 'Hétérogène') trancheScore += 0;

  const mc = input.metreCubeEstime;
  if (mc <= 1.344) trancheScore += 0;
  else if (mc <= 2) trancheScore += 1;
  else if (mc <= 2.5) trancheScore += 2;
  else trancheScore += 3;

  // const vol = input.volumeStockEstime;
  // if (vol < 100) trancheScore += 1;
  // else if (vol < 500) trancheScore += 0;
  // else if (vol < 1000) trancheScore += -1;
  // else if (vol < 2000) trancheScore += -2;
  // else trancheScore += -3;

  const poids = input.poidsEstime * 100;
  if (poids < 1000) trancheScore += 0;
  else if (poids < 1500) trancheScore += 1;
  else if (poids < 2000) trancheScore += 2;
  else if (poids < 3000) trancheScore += 3;
  else trancheScore += 4;

  const averageRA = input.valeursRA.reduce((a, b) => a + b, 0) / input.valeursRA.length;
  const trancheLabel = getTrancheLabel(trancheScore);
  const multiplier = trancheMultiplierMap[trancheLabel] ?? 1;

  const finalPrice = Math.round(input.pu * input.reductionAugmentation * multiplier * 100) / 100;

  return { trancheScore, trancheLabel, averageRA, finalPrice };
}
