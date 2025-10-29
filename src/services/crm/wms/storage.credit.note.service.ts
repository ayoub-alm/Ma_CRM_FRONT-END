import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StorageCreditNoteResponseDto} from '../../../dtos/response/crm/storage.credit.note.response.dto';
import {StorageInvoiceResponseDto} from '../../../dtos/response/crm/storage.invoice.response.dto';


@Injectable({
  providedIn: 'root',
})

export class StorageCreditNoteService{
  private readonly baseUrl: string = environment.baseUrl + "/api/wms/credit-notes"; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  /**
   *
   * @param companyId
   */
  getAllStorageCreditNoteByCompanyId(companyId: number): Observable<StorageCreditNoteResponseDto[]> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<StorageCreditNoteResponseDto[]>(`${this.baseUrl}`, {params})
  }

  /**
   *
   * @param creditNoteId
   */
  getStorageCreditNoteById(creditNoteId:number): Observable<StorageCreditNoteResponseDto> {
    return this.http.get<StorageCreditNoteResponseDto>(`${this.baseUrl}/${creditNoteId}`)
  }
  /**
   * This function allows to create new Stoege credit note by invoice id
   * @param createStorageCreditNoteDto
   */
  createStorageCreditNote(createStorageCreditNoteDto: CreateStorageCreditNoteDto): Observable<StorageCreditNoteResponseDto> {
    return this.http.post<StorageCreditNoteResponseDto>(`${this.baseUrl}`, createStorageCreditNoteDto)
  }

  updateStorageCreditNote(updateRequest: UpdateStorageCreditNoteDto): Observable<StorageCreditNoteResponseDto>  {
    return this.http.put<StorageCreditNoteResponseDto>(`${this.baseUrl}`, updateRequest)
  }
}


export class CreateStorageCreditNoteDto{
  private amountHt: number;
  private invoiceId: number | undefined;

  constructor(invoiceId: number | undefined, amountHt: number) {
    this.amountHt = amountHt;
    this.invoiceId = invoiceId;
  }
}

export class UpdateStorageCreditNoteDto{
  private id :number;
  private totalHt: number;
  private tva: number;
  private totalTtc: number;
  private sendDate: string;
  private sendStatus: string;
  private returnDate: string;
  private returnStatus: string;
  constructor(data: any) {
    this.id = data.id;
    this.tva = data.tva;
    this.totalHt = data.totalHt;
    this.totalTtc = data.totalTtc;
    this.sendDate = data.sendDate;
    this.sendStatus = data.sendStatus;
    this.returnDate = data.returnDate;
    this.returnStatus = data.returnStatus;

  }
}
