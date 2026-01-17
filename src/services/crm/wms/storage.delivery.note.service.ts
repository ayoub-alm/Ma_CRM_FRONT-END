import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StorageDeliveryNoteResponseDto } from '../../../dtos/response/crm/storage.delivery.note.response.dto';

@Injectable({
  providedIn: 'root',
})
export class StorageDeliveryNoteService {
  private readonly baseUrl: string = environment.baseUrl + "/api/storage-delivery-notes";
  constructor(private http: HttpClient) {
  }

  /**
   * Create New note from contract id
   * @param storageContractId
   */
  createNewNoteByContractIds(storageContractId: number): Observable<any> {
    return this.http.post<Observable<any>>(`${(this.baseUrl)}`, { storageContractId: storageContractId })
  }


  getAllStorageDeliveryNoteByCompanyId(companyId: number): Observable<StorageDeliveryNoteResponseDto[]> {
    return this.http.get<StorageDeliveryNoteResponseDto[]>(`${(this.baseUrl)}/company/${companyId}`,)
  }

  getStorageDeliveryNoteById(storageDeliveryNoteId: number): Observable<StorageDeliveryNoteResponseDto> {
    return this.http.get<StorageDeliveryNoteResponseDto>(`${(this.baseUrl)}/${storageDeliveryNoteId}`,)
  }


  updateProvisionQuantity(
    storageDeliveryNoteId: number,
    provisionId: number,
    quantity: number
  ): Observable<StorageDeliveryNoteResponseDto> {
    const url = `${this.baseUrl}/provision/update`;
    const body: UpdateDeliveryNoteQuantityDto = {
      quantity: quantity,
      storageDeliveryNoteId: storageDeliveryNoteId,
      provisionId: provisionId,
      unloadingId: 0,
      requirementId: 0
    };
    return this.http.put<StorageDeliveryNoteResponseDto>(url, body);
  }

  updateUnloadingQuantity(
    storageDeliveryNoteId: number,
    unloadingId: number,
    quantity: number
  ): Observable<StorageDeliveryNoteResponseDto> {
    const url = `${this.baseUrl}/unloading/update`;
    const body: UpdateDeliveryNoteQuantityDto = {
      quantity: quantity,
      storageDeliveryNoteId: storageDeliveryNoteId,
      unloadingId: unloadingId,
      requirementId: 0,
      provisionId: 0
    };
    return this.http.put<StorageDeliveryNoteResponseDto>(url, body);
  }


  updateRequirementQuantity(
    storageDeliveryNoteId: number,
    requirementId: number,
    quantity: number
  ): Observable<StorageDeliveryNoteResponseDto> {
    const url = `${this.baseUrl}/requirement/update`;
    const body: UpdateDeliveryNoteQuantityDto = {
      quantity: quantity,
      storageDeliveryNoteId: storageDeliveryNoteId,
      requirementId: requirementId,
      provisionId: 0,
      unloadingId: 0
    };
    return this.http.put<StorageDeliveryNoteResponseDto>(url, body);
  }

  createModificationRequest(storageDeliveryNoteId: number, note: string): Observable<StorageDeliveryNoteResponseDto> {
    const url = `${this.baseUrl}/update-request/${storageDeliveryNoteId}`;
    return this.http.put<StorageDeliveryNoteResponseDto>(url, { note: note });
  }

  /**
   * Validate an update request and synchronize the associated invoice
   * @param requestId the update request ID
   */
  validateUpdateRequest(requestId: number): Observable<any> {
    const url = `${environment.baseUrl}/api/delivery-note-update-requests/${requestId}/validate`;
    return this.http.post<any>(url, {});
  }
}


export interface UpdateDeliveryNoteQuantityDto {
  quantity: number;
  storageDeliveryNoteId: number;
  provisionId?: number;
  requirementId?: number;
  unloadingId?: number;
}

