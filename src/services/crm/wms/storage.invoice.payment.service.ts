import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {StorageInvoicePaymentRequestDto} from '../../../dtos/request/crm/storage.invoice.payment.request.dto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageInvoicePaymentService {
  private readonly baseUrl:string = environment.baseUrl + "/api/storage-invoice-payments";
  constructor(private http:HttpClient) {
  }

  /**
   * This function allows to add a new payment method to storage invoice
   * @param storageInvoicePaymentRequestDto
   */

  createStorageInvoicePayment(storageInvoicePaymentRequestDto: StorageInvoicePaymentRequestDto): Observable<any>{
    return this.http.post(`${this.baseUrl}`, storageInvoicePaymentRequestDto)
  }
}
