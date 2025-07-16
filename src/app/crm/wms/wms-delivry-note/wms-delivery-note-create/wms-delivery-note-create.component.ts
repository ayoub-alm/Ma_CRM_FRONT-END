import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {BehaviorSubject, tap} from 'rxjs';
import {ProspectResponseDto} from '../../../../../dtos/response/prospect.response.dto';
import {ProspectService} from '../../../../../services/Leads/prospect.service';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {Router} from '@angular/router';
import {MatCard, MatCardContent} from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {StorageContractService} from '../../../../../services/crm/wms/storage.contract.service';
import {StorageContractResponseDto} from '../../../../../dtos/response/crm/storage.contract.response.dto';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {DiscountTypeEnum} from '../../../../../enums/discount.type.enum';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {StorageDeliveryNoteService} from '../../../../../services/crm/wms/storage.delivery.note.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-wms-delivery-note-create',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatCard,
    MatCardContent,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    NgForOf,
    MatIcon,
    NgIf,
    CurrencyPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatIconButton
  ],
  templateUrl: './wms-delivery-note-create.component.html',
  styleUrl: './wms-delivery-note-create.component.css'
})
export class WmsDeliveryNoteCreateComponent implements OnInit {
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  filteredCustomers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  contracts: BehaviorSubject<StorageContractResponseDto[]> = new BehaviorSubject<StorageContractResponseDto[]>([]);
  selectedStorageContract: BehaviorSubject<StorageContractResponseDto> = new BehaviorSubject<StorageContractResponseDto>({} as StorageContractResponseDto);
  storageDeliveryNoteForm!: FormGroup;
  displayedColumns: string[] =  ['name',"unite", "quantity"];
  selectedCustomer:BehaviorSubject<ProspectResponseDto | null> =  new BehaviorSubject<ProspectResponseDto | null>(null);
  constructor(private customersService: ProspectService, private localStorageService: LocalStorageService,
              public router: Router, private storageContractService: StorageContractService, private fb:FormBuilder,
              private deliveryNoteService: StorageDeliveryNoteService, private snackBar: MatSnackBar) { }


  ngOnInit() {
    this.initializeContractFrom();
    this.customersService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(tap(customers => {
      this.customers.next(customers);
    })).subscribe()

  }

  initializeContractFrom() {
    this.storageDeliveryNoteForm = this.fb.group({
      customerId: ['', Validators.required],
      contractIds: [[], Validators.required],
      provisions: this.fb.array([]),      // Stocked Items Provisions
      unloadingTypes: this.fb.array([]),  // Dépotage
      requirements: this.fb.array([]),    // Exigences
    });

    this.storageDeliveryNoteForm.get('customerId')?.valueChanges.subscribe((customer: ProspectResponseDto) => {
      this.storageContractService.getActiveStorageContractByCustomerId(customer.id).subscribe(contracts => {
        this.contracts.next(contracts.filter(contract => contract.parentContract == null));
        this.selectedCustomer.next(customer);
      });
    });

    this.storageDeliveryNoteForm.get('contractIds')?.valueChanges.subscribe(contractId => {
      const selectedContract = this.contracts.getValue()
        .find(contract => contract.id === contractId);
      if (selectedContract) {
        this.selectedStorageContract.next(selectedContract);
      }
    });
  }



  onSelectCustomer(customer: ProspectResponseDto) {
      // this.storageDeliveryNoteForm.get("customerId")?.valueChanges.subscribe(customer => {})
  }

  onFilterCustomer(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredCustomers.next(this.customers.getValue().filter(customer =>
      customer.name.toLowerCase().includes(searchValue.toLowerCase())));
  }

  protected readonly DiscountTypeEnum = DiscountTypeEnum;

  /**
   *
   */
  onCreateNewNote() {
    if (this.selectedStorageContract.getValue()){
      this.deliveryNoteService.createNewNoteByContractIds(this.selectedStorageContract.getValue().id).subscribe({
        next: (res) => {
          this.snackBar.open("Bon de livraison créé avec success", "OK", {duration:3000})
          this.router.navigateByUrl("/admin/crm/wms/delivery-note/show/"+res.id).then()
        }
      })
    }else{
      this.snackBar.open("Merci de valider les donées", "OK", {duration:3000});
    }

  }

  onRestSelectCustomer() {
    this.selectedCustomer.next(null);
    this.storageDeliveryNoteForm.reset();
  }
}
