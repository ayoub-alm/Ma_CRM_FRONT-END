import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {GeneralInfosComponent} from '../../../../utils/general-infos/general-infos.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {BehaviorSubject, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageInvoiceService, StorageInvoiceUpdateDto} from '../../../../../services/crm/wms/storage.invoice.service';
import {StorageInvoiceResponseDto} from '../../../../../dtos/response/crm/storage.invoice.response.dto';
import {PrintService} from '../../../../../services/docs/print.service';
import {MatDialog} from '@angular/material/dialog';
import {AddUpdatePaymentDialogComponent} from '../add-update-payment-dialog/add-update-payment-dialog.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StorageInvoicePaymentService} from '../../../../../services/crm/wms/storage.invoice.payment.service';
import {StorageInvoicePaymentRequestDto} from '../../../../../dtos/request/crm/storage.invoice.payment.request.dto';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-wms-invoice-show',
  standalone: true,
  imports: [
    DatePipe,
    GeneralInfosComponent,
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatMenu,
    MatMenuItem,
    NgForOf,
    MatMenuTrigger,
    NgClass,
    NgIf,
    MatIconButton,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggle,
    TranslatePipe
  ],
  templateUrl: './wms-invoice-show.component.html',
  styleUrl: './wms-invoice-show.component.css'
})
export class WmsInvoiceShowComponent implements OnInit, AfterViewInit {
  isEditing: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);
  invoice: BehaviorSubject<StorageInvoiceResponseDto> = new BehaviorSubject<StorageInvoiceResponseDto>({} as StorageInvoiceResponseDto);
  invoiceForm!:FormGroup;
  constructor(private printService: PrintService,private activeRouter: ActivatedRoute, private dialog: MatDialog,
              public router: Router, private snackBar: MatSnackBar, private storageInvoiceService: StorageInvoiceService,
              private fb: FormBuilder, private paymentService: StorageInvoicePaymentService) {
  }

  ngOnInit() {
    this.loadStorageInvoice();
  }
  ngAfterViewInit() {
    // listen to value changes in invoice form and update by calling the service
    this.invoiceForm.valueChanges.subscribe(() => {
      this.onUpdateInvoice()
    });
  }

  loadStorageInvoice():void{
    const storageDeliveryNoteId:number = this.activeRouter.snapshot.params['id'];
    this.storageInvoiceService.getStorageInvoicesById(storageDeliveryNoteId).pipe(tap(storageInvoice => {
      this.invoice.next(storageInvoice);

      // Populate updateDto with current invoice values for convenience
      this.invoiceForm = this.fb.group({
        sendDate: [storageInvoice.sendDate ?? null],
        sendStatus: [storageInvoice.sendStatus ?? ''],
        returnDate: [storageInvoice.returnDate ?? null],
        returnStatus: [storageInvoice.returnStatus ?? ''],
        invoiceDate: [storageInvoice.invoiceDate ?? ''],
        dueDate: [storageInvoice.dueDate ?? '']
      });

      if(this.invoice.getValue()?.status.id >= 1){
        this.isEditing.next(false);
      }
    })).subscribe()
  }

  onSoftDeleteDeliveryNote() {

  }


  onPrintInvoice() {
    this.printService.generateInvoiceById(this.invoice.getValue().id)
    this.snackBar.open("Le téléchargement va commencer dans quelques secondes...", "ok", {duration:3000})
  }

  OnAddPayment() {
    const dialogRef = this.dialog.open(AddUpdatePaymentDialogComponent, {
      data: this.invoice.getValue(),
      width: '600px',
      maxWidth: '600px',
    })

    dialogRef.afterClosed().subscribe(result => {
      this.loadStorageInvoice();
    })
  }

  /**
   * This function allows to get sum of payment of storage invoice
   */
  getSumOfPayments(): number {
    let total = 0;
    this.invoice.getValue().storageInvoicePaymentRequestDtos.forEach(value => {
      total +=  value.amount;
    })
    return total;
  }

  /**
   * This function
   */
  onUpdateInvoice(): void {
    const invoiceId = this.invoice.getValue().id;
    const updateData = new StorageInvoiceUpdateDto({
      sendDate : this.invoiceForm.value.sendDate,
      sendStatus : this.invoiceForm.value.sendStatus,
      returnDate : this.invoiceForm.value.returnDate,
      returnStatus : this.invoiceForm.value.returnStatus,
      invoiceDate: this.invoiceForm.value.invoiceDate,
      dueDate: this.invoiceForm.value.dueDate
    });
    this.storageInvoiceService.updateStorageInvoice(invoiceId, updateData).subscribe({
      next: (updatedInvoice) => {
        this.invoice.next(updatedInvoice);
        this.snackBar.open('Facture mise à jour avec succès!', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open("Erreur lors de la mise à jour.", "OK", { duration: 3000 });
      }
    });
  }

  /**
   * this function allows to get payment status by calculated the sum of payments and invoice total TTC
   */
  getPaymentStatus(): string {
    if (this.getSumOfPayments() == 0 || null) return "N'est pas payée"
    if (this.getSumOfPayments() >= this.invoice.getValue().totalTtc){
      return "Payée";
    }else if (this.getSumOfPayments() < this.invoice.getValue().totalTtc){
      return "Partiellement Payée";
    }else {
      return "N'est pas payée";
    }
  }

  /**
   * this function allows to get css class for payment status
   */
  getPaymentStatusClass() {
    if (this.getSumOfPayments() == 0 || null) return "btn btn-sm  btn-danger rounded-2 scale-08 text-white "
    if (this.getSumOfPayments() >= this.invoice.getValue().totalTtc){
      return "btn  btn-sm btn-success rounded-2 scale-08 text-white ";
    }else if (this.getSumOfPayments() < this.invoice.getValue().totalTtc){
      return "btn  btn-sm btn-warning rounded-2 scale-08 text-white ";
    }else {
      return "btn btn-sm  btn-danger rounded-2 scale-08 text-white ";
    }
  }

  onValidateFinances() {
    this.storageInvoiceService.validate(this.invoice.getValue().id).subscribe({
      next: (updatedInvoice) => {
        this.invoice.next(updatedInvoice);
        this.snackBar.open('Facture mise à jour avec succès!', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open("Erreur lors de la mise à jour.", "OK", { duration: 3000 });
      }
    });
  }

  onValidateSales() {
    this.storageInvoiceService.validateSales(this.invoice.getValue().id).subscribe({
      next: (updatedInvoice) => {
        this.invoice.next(updatedInvoice);
        this.snackBar.open('Facture mise à jour avec succès!', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open("Erreur lors de la mise à jour.", "OK", { duration: 3000 });
      }
    });
  }

  onValidatePayment(payment: StorageInvoicePaymentRequestDto) {
    this.paymentService.validateStorageInvoicePayment(payment.id).pipe(
      tap(data => this.loadStorageInvoice())
    ).subscribe({})
  }
}
