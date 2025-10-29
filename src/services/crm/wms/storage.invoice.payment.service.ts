import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {StorageInvoicePaymentRequestDto} from '../../../dtos/request/crm/storage.invoice.payment.request.dto';
import {Observable} from 'rxjs';
import {StorageInvoicePaymentResponseDto} from '../../../dtos/response/crm/storage.invoice.payment.response.dto';

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

  validateStorageInvoicePayment(paymentId: number): Observable<any>{
    return this.http.put(`${this.baseUrl}/validate/${paymentId}`, {})
  }

  getAllStoragePaymentByCompanyId(companyId: number): Observable<StorageInvoicePaymentResponseDto[]>{
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<StorageInvoicePaymentResponseDto[]>(`${this.baseUrl}`, {params})
  }

  getStoragePaymentById(paymentId: number): Observable<StorageInvoicePaymentResponseDto>{
    return this.http.get<StorageInvoicePaymentResponseDto>(`${this.baseUrl}/${paymentId}`)
  }
}


