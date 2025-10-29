import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StorageInvoiceResponseDto} from '../../../dtos/response/crm/storage.invoice.response.dto';

@Injectable({providedIn: 'root'})

export class StorageInvoiceService {
  private readonly baseUrl:string = environment.baseUrl + "/api/storage-invoices";
  constructor(private http:HttpClient) {
  }

  /**
   * this function allows to get all storage invoices by company id
   * @param companyId the id of the current company
   */
  getAllStorageInvoicesByCompanyId(companyId:number): Observable<StorageInvoiceResponseDto[]>{
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<StorageInvoiceResponseDto[]>(`${(this.baseUrl)}`,{params})
  }

  /**
   * this function allows to get invoices by customer id
   * @param customerId
   */
  getAllStorageInvoicesByCustomerId(customerId:number): Observable<StorageInvoiceResponseDto[]>{
    return this.http.get<StorageInvoiceResponseDto[]>(`${this.baseUrl}/customer/${customerId}`)
  }

  /**
   * this function allows to get  storage invoices by  id
   * @param invoiceId the id of the current company
   */
  getStorageInvoicesById(invoiceId:number): Observable<StorageInvoiceResponseDto>{
    return this.http.get<StorageInvoiceResponseDto>(`${(this.baseUrl)}/${invoiceId}`)
  }

  validate(invoiceId:number): Observable<StorageInvoiceResponseDto>{
    return this.http.get<StorageInvoiceResponseDto>(`${(this.baseUrl)}/validate/${invoiceId}`)
  }

  validateSales(invoiceId:number): Observable<StorageInvoiceResponseDto>{
    return this.http.get<StorageInvoiceResponseDto>(`${(this.baseUrl)}/validate-sales/${invoiceId}`)
  }

  /**
   * create Storage invoice from storage delivery note by id
   * @param storageDeliveryNoteId
   */
  createStorageInvoiceByDeliveryNoteId(storageDeliveryNoteId: number):Observable<StorageInvoiceResponseDto>{
    const data = new CreateInvoiceDto(storageDeliveryNoteId)
    return this.http.post<StorageInvoiceResponseDto>(`${this.baseUrl}`, data)
  }

  /**
   * this function allows to update a storage invoice by its ID
   * @param invoiceId the ID of the invoice to update
   * @param updatedData the new data to update the invoice
   */
  updateStorageInvoice(invoiceId: number, updatedData: StorageInvoiceUpdateDto): Observable<StorageInvoiceResponseDto> {
    return this.http.put<StorageInvoiceResponseDto>(`${this.baseUrl}/${invoiceId}`, updatedData);
  }

  /**
   * This function allows to update Storage Invoice From Update request
   * @param invoiceId storage invoice request
   * @param storageDeliveryNoteId storage delivery note ID
   */
  updateStorageInvoiceFromDeliveryNoteUpdateRequest(invoiceId: number, storageDeliveryNoteId: number,requestId: number): Observable<StorageInvoiceResponseDto> {
    return this.http.put<StorageInvoiceResponseDto>(
      `${this.baseUrl}/update-from-delivery-note-update-request/${invoiceId}/${storageDeliveryNoteId}/${requestId}`,{});
  }
}


class CreateInvoiceDto{
  constructor(public storageDeliveryNoteId :number) {
  }
}


export class StorageInvoiceUpdateDto {
  public sendDate: string | null;      // ISO date string (e.g., "2025-06-21")
  public sendStatus: string | null;
  public returnDate: string | null;    // ISO date string
  public returnStatus: string | null;
  public invoiceDate: string | null;
  public dueDate: string | null;

  constructor(data:any) {
    this.sendDate = data.sendDate;
    this.sendStatus = data.sendStatus;
    this.returnDate = data.returnDate;
    this.returnStatus = data.returnStatus;
    this.invoiceDate = data.invoiceDate;
    this.dueDate =  data.dueDate;
  }
}
