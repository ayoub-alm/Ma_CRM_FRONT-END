import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {StorageNeedResponseDto} from '../../../dtos/response/crm/storage.need.response.dto';
import {StorageNeedCreateDto} from '../../../dtos/request/crm/storage.need.create.dto';
import {environment} from '../../../environments/environment';
import {StorageOfferCreateDto} from '../../../dtos/request/crm/storage.offer.create.dto';
import {StorageOfferModel} from '../../../models/storage.offer.model';
import {StorageOfferResponseDto} from '../../../dtos/response/crm/storage.offer.response.dto';
import {StorageContractResponseDto} from '../../../dtos/response/crm/storage.contract.response.dto';


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
   * Update an existing storage contract.
   * @param id - ID of the storage need to update.
   * @param storageNeed - DTO containing updated data.
   * @returns Observable of StorageNeedResponseDto.
   */
  updateStorageContract(id: number, storageNeed: StorageNeedCreateDto): Observable<StorageNeedResponseDto> {
    return this.http.put<StorageNeedResponseDto>(`${this.baseUrl}/${id}`, storageNeed);
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
}
