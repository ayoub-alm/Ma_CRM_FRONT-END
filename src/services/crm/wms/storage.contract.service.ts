import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {StorageNeedResponseDto} from '../../../dtos/response/crm/storage.need.response.dto';
import {StorageNeedCreateDto} from '../../../dtos/request/crm/storage.need.create.dto';
import {environment} from '../../../environments/environment';
import {StorageOfferCreateDto} from '../../../dtos/request/crm/storage.offer.create.dto';
import {StorageOfferModel} from '../../../models/storage.offer.model';
import {StorageOfferResponseDto} from '../../../dtos/response/crm/storage.offer.response.dto';
import {StorageContractResponseDto} from '../../../dtos/response/crm/storage.contract.response.dto';
import {StorageContractUpdateDto} from '../../../dtos/request/crm/storage.contract.update.dto';
import {ProspectResponseDto} from '../../../dtos/response/prospect.response.dto';
import {StorageAnnexeResponseDto} from '../../../dtos/response/crm/storage.annexe.response.dto';


@Injectable({
  providedIn: 'root',
})
export class StorageContractService {
  private readonly baseUrl: string = environment.baseUrl + "/api/wms/contracts"; // Replace with your API endpoint

  constructor(private http: HttpClient) {}


  /**
   * Fetch all storage contracts by company ID.
   * @param companyId - ID of the company.
   * @returns Observable of StorageContractResponseDto[].
   */
  getAllStorageContractsByCompanyId(companyId: number): Observable<StorageContractResponseDto[]> {
    return this.http.get<StorageContractResponseDto[]>(`${this.baseUrl}?companyId=${companyId}`);
  }


  /**
   * Fetch a single storage contract by ID.
   * @param id - ID of the storage contract.
   * @returns Observable of StorageContractResponseDto.
   */
  getStorageContractById(id: number): Observable<StorageContractResponseDto> {
    return this.http.get<StorageContractResponseDto>(`${this.baseUrl}/${id}`).pipe(
      tap(data => {new StorageContractResponseDto(data)}));
  }


  /**
   * Delete a storage contract by ID.
   * @param id - ID of the storage need to delete.
   * @returns Observable of void.
   */
  deleteStorageContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * This function allows to get One contract by customer id
   * @param customerId
   */
  getStorageContractByCustomerId(customerId: number): Observable<StorageContractResponseDto[]> {
    return this.http.get<StorageContractResponseDto[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  /**
   * This function creates a storage contract from an offer by providing the Offer ID.
   * @param offerId - The ID of the storage offer.
   * @returns {Observable<StorageContractResponseDto>}
   */
  createStorageContractFromOffer(offerId: number): Observable<StorageContractResponseDto> {
    return this.http.get<StorageContractResponseDto>(`${this.baseUrl}/create-from-offer/${offerId}`).pipe(
      map(data => new StorageContractResponseDto(data)), // Ensuring proper transformation
      tap(response => console.log('Storage Contract Created:', response)),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * update Storage contract
   * @param storageContract
   * @return {Observable<StorageContractResponseDto>}
   */
  updateStorageContract(storageContract: StorageContractUpdateDto): Observable<StorageContractResponseDto>{
    return this.http.put<StorageContractResponseDto>(`${this.baseUrl}/update`, storageContract)
  }



  /**
   * Upload contract PDF
   */
  uploadContractPdf(contractId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/${contractId}/upload-pdf`, formData, {
      responseType: 'text',
    });
  }

  /**
   * this function allows to check if customer has active contract
   * @param customerId the customer id
   */
  checkIfCustomerHasActiveContract(customerId: number): Observable<boolean>{
    return this.http.get<boolean>(`${this.baseUrl}/active/${customerId}`)
  }

  /**
   * this function allows to get active storage contract for a customer bg his ID
   * @param customerId the customer ID
   * @return {Observable<ProspectResponseDto[]>} list od active contracts
   */
  getActiveStorageContractByCustomerId(customerId: number): Observable<StorageContractResponseDto[]>{
    return this.http.get<StorageContractResponseDto[]>(`${this.baseUrl}/active-contract/${customerId}`)
  }

  createStorageContractAnnexeFromOffer(offerId:number, contractId:number): Observable<StorageContractResponseDto>{
    return this.http.get<StorageContractResponseDto>(`${this.baseUrl}/create-from-offer/${offerId}/contract/${contractId}`)
  }

  /**
   * this function allows to update storage contract payment infos
   * @param paymentMethodId
   * @param paymentMethodAmount
   * @param storageContractId
   */
  updateStorageContractPaymentType(paymentMethodId: number,paymentMethodAmount: number,storageContractId: number): Observable<StorageContractResponseDto> {
    return this.http.post<StorageContractResponseDto>(`${this.baseUrl}/update-payment-infos/${storageContractId}`,
      {paymentMethodId: paymentMethodId, paymentMethodAmount: paymentMethodAmount})
  }

  getStorageAnnexeById(annexeId: number): Observable<StorageAnnexeResponseDto>{
    return this.http.get<StorageAnnexeResponseDto>(`${this.baseUrl}/storage-annexe/${annexeId}`)
  }
}
