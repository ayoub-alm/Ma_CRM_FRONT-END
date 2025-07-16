import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {StorageInvoicePaymentService} from '../../../../../services/crm/wms/storage.invoice.payment.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {BehaviorSubject, tap} from 'rxjs';
import {PaymentMethodService} from '../../../../../services/data/payemet.method.service';
import {PaymentMethodResponseDto} from '../../../../../dtos/init_data/response/paymentMethodResponseDto';
import {StorageInvoicePaymentRequestDto} from '../../../../../dtos/request/crm/storage.invoice.payment.request.dto';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-update-payment-dialog',
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './add-update-payment-dialog.component.html',
  styleUrl: './add-update-payment-dialog.component.css'
})
export class AddUpdatePaymentDialogComponent implements OnInit{
  public paymentForm!: FormGroup;
  paymentMethos: BehaviorSubject<PaymentMethodResponseDto[]> = new BehaviorSubject<PaymentMethodResponseDto[]>([])
   constructor(private dialogRef: MatDialogRef<AddUpdatePaymentDialogComponent>,@Inject(MAT_DIALOG_DATA)private data: any,
               private paymentService: StorageInvoicePaymentService, private fb: FormBuilder, private paymentMethodService: PaymentMethodService,
               private snackBar: MatSnackBar) {
     this.paymentForm =  this.fb.group({
       paymentMethod: ["", Validators.required],
       ref: ["", Validators.required],
       amount:["", Validators.required],
       invoiceId:["", Validators.required],
     })
   }

   ngOnInit() {
    this.paymentMethodService.getAllPaymentMethods().pipe(
      tap(data => this.paymentMethos.next(data))
    ).subscribe()
   }

  /**
   * this function allows to create a new payment method
   */
  addPayment() {
    this.paymentForm.get("invoiceId")?.setValue(this.data.id)
    this.paymentForm.markAllAsTouched();
    console.log(this.paymentForm.value);
    if (this.paymentForm.valid) {
      const payment = new StorageInvoicePaymentRequestDto(this.paymentForm.value);
      this.paymentService.createStorageInvoicePayment(payment).
        pipe(tap(data => {
          this.snackBar.open("Le piemnt a été bien Ajouté", "ok", {duration: 3000})
          this.dialogRef.close();
        })
      ).subscribe()
    }else{
      this.snackBar.open("Merci de saisaire des donées valide ", "Ok", {duration:3000, panelClass:["text-danger"]})
    }
  }
}
