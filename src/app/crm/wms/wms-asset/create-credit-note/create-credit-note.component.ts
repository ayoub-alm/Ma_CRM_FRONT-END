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
import {BehaviorSubject, tap} from 'rxjs';
import {UniteOfMeasurementResponseDto} from '../../../../../dtos/init_data/response/unite.of.measurement.dto';
import {UnitOfMeasurementsService} from '../../../../../services/data/unit.of.measurements.service';
import {ProvisionResponseDto} from '../../../../../dtos/response/crm/provision.response.dto';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';
import {TranslatePipe} from '@ngx-translate/core';
import {StorageInvoiceResponseDto} from '../../../../../dtos/response/crm/storage.invoice.response.dto';
import {ProspectResponseDto} from '../../../../../dtos/response/prospect.response.dto';
import {StorageInvoiceService} from '../../../../../services/crm/wms/storage.invoice.service';
import {ProspectService} from '../../../../../services/Leads/prospect.service';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {
  CreateStorageCreditNoteDto,
  StorageCreditNoteService
} from '../../../../../services/crm/wms/storage.credit.note.service';

@Component({
  selector: 'app-create-credit-note',
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
    ReactiveFormsModule,
    TranslatePipe,
    MatAutocomplete,
    MatAutocompleteTrigger
  ],
  templateUrl: './create-credit-note.component.html',
  styleUrl: './create-credit-note.component.css'
})
export class CreateCreditNoteComponent implements OnInit {
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  filteredCustomers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  selectedCustomer:BehaviorSubject<ProspectResponseDto | null> =  new BehaviorSubject<ProspectResponseDto | null>(null);
  invoices: BehaviorSubject<StorageInvoiceResponseDto[]> = new BehaviorSubject<StorageInvoiceResponseDto[]>([]);
  selectedInvoice: BehaviorSubject<StorageInvoiceResponseDto | null> = new BehaviorSubject<StorageInvoiceResponseDto | null>({} as StorageInvoiceResponseDto);
  storageCreditNoteForm: FormGroup;
  constructor(private fb: FormBuilder, public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: ProvisionResponseDto,
              private localStorageService: LocalStorageService, private creditNoteService: StorageCreditNoteService,
              private snackBar: MatSnackBar,private dialogRef: MatDialogRef<CreateCreditNoteComponent>,
              private invoiceService: StorageInvoiceService, private customerService: ProspectService) {
    this.storageCreditNoteForm = this.fb.group({
      customer: new FormControl("", [Validators.required]),
      invoice: new FormControl("", [Validators.required]),
      amountHt:["", [Validators.required]],
      // order: new FormControl("", [Validators.required]),
    })
  }

  ngOnInit() {
    //load customers
   this.customerService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(
     tap((data) => {
       this.customers.next(data);
       this.filteredCustomers.next(data);
     })
   ).subscribe()
  }


  /**
   * this function allows to create new storage credit note
   */
  OnAddNewCreditNote() {
    const invoice = this.selectedInvoice.getValue();
    const creditNoteDetails: CreateStorageCreditNoteDto =  new CreateStorageCreditNoteDto(
      invoice?.id,this.storageCreditNoteForm.get("amountHt")?.value);
    if (invoice && invoice.id !== undefined) {
      this.creditNoteService.createStorageCreditNote(creditNoteDetails).pipe(
        tap((data) => {
          this.snackBar.open("Credit Note Created With Success" , "OK" , {duration:3000})
          // this.dialog.closeAll();
          this.dialogRef.close(true);
        })
      ).subscribe();
    }
  }

  /**
   * this function allows to filter customer by when user typing
   * @param event
   */
  onFilterCustomer(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredCustomers.next(this.customers.getValue().filter(customer =>
      customer.name.toLowerCase().includes(searchValue.toLowerCase())));
  }
  onFilterInvoices(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.invoices.next(this.invoices.getValue().filter(invoice =>
      invoice.number.toLowerCase().includes(searchValue.toLowerCase())));
  }

  /**
   *
   * @param customer
   */
  onSelectCustomer(customer: ProspectResponseDto) {
    this.selectedCustomer.next(customer);
    this.invoiceService.getAllStorageInvoicesByCustomerId(customer.id).pipe(
      tap((data) => {
        this.invoices.next(data);
      })
    ).subscribe();
  }

  /**
   * this function allows to reset selected customer
   */
  onRestSelectCustomer() {
    this.selectedCustomer.next(null);
    this.selectedInvoice.next(null);
    this.invoices.next([]);
  }

  /**
   *
   * @param invoice
   */
  onSelectInvoice(invoice: StorageInvoiceResponseDto) {
    this.selectedInvoice.next(invoice);
  }
}
