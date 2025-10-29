import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {GeneralInfosComponent} from '../../../../utils/general-infos/general-infos.component';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {BehaviorSubject, tap} from 'rxjs';
import {StorageCreditNoteResponseDto} from '../../../../../dtos/response/crm/storage.credit.note.response.dto';
import {StorageInvoicePaymentService} from '../../../../../services/crm/wms/storage.invoice.payment.service';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {StorageInvoicePaymentResponseDto} from '../../../../../dtos/response/crm/storage.invoice.payment.response.dto';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {StorageInvoicePaymentRequestDto} from '../../../../../dtos/request/crm/storage.invoice.payment.request.dto';

@Component({
  selector: 'app-wms-payment-show',
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
    ReactiveFormsModule,
    TranslatePipe,
    MatMenuTrigger,
    NgClass,
    NgForOf,
    MatSlideToggle,
    NgIf
  ],
  templateUrl: './wms-payment-show.component.html',
  styleUrl: './wms-payment-show.component.css'
})
export class WmsPaymentShowComponent implements OnInit {
  payment: BehaviorSubject<StorageInvoicePaymentResponseDto> = new BehaviorSubject<StorageInvoicePaymentResponseDto>({} as StorageInvoicePaymentResponseDto);
  constructor(private paymentService: StorageInvoicePaymentService, private localStorageService: LocalStorageService,
              private activeRouter: ActivatedRoute, protected router: Router) {
  }

  ngOnInit() {
    this.loadStoragesPayment()
  }

  /**
   *
   */
  loadStoragesPayment(){
    const paymentId:number = this.activeRouter.snapshot.params['id'];
    this.paymentService.getStoragePaymentById(paymentId).pipe(
      tap(payment => {
        this.payment.next(payment)
      })
    ).subscribe();
  }

  onValidatePayment() {
    this.paymentService.validateStorageInvoicePayment(this.payment.getValue().id).pipe(
      tap(data => this.loadStoragesPayment())
    ).subscribe({})
  }
}
