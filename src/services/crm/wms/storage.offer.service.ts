import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {StorageNeedResponseDto} from '../../../dtos/response/crm/storage.need.response.dto';
import {StorageNeedCreateDto} from '../../../dtos/request/crm/storage.need.create.dto';
import {environment} from '../../../environments/environment';
import {StorageOfferCreateDto} from '../../../dtos/request/crm/storage.offer.create.dto';
import {StorageOfferModel} from '../../../models/storage.offer.model';
import {StorageOfferResponseDto} from '../../../dtos/response/crm/storage.offer.response.dto';


@Injectable({
  providedIn: 'root',
})
export class StorageOfferService {
  private readonly baseUrl: string = environment.baseUrl + "/api/wms/offers"; // Replace with your API endpoint

  constructor(private http: HttpClient) {}


  /**
   * Fetch all storage needs by company ID.
   * @param companyId - ID of the company.
   * @returns Observable of StorageNeedResponseDto[].
   */
  getAllStorageOffersByCompanyId(companyId: number): Observable<StorageOfferResponseDto[]> {
    return this.http.get<StorageOfferResponseDto[]>(`${this.baseUrl}?companyId=${companyId}`);
  }


  /**
   * Create a new storage offer.
   * @param storageOffer - DTO containing data for the new storage need.
   * @returns Observable of StorageOfferModel.
   */
  createStorageOffer(storageOffer: StorageOfferCreateDto): Observable<StorageOfferModel> {
    return this.http.post<StorageOfferModel>(this.baseUrl, storageOffer);
  }

  /**
   * Fetch a single storage offer by ID.
   * @param id - ID of the storage offer.
   * @returns Observable of StorageOfferResponseDto.
   */
  getStorageOfferById(id: number): Observable<StorageOfferResponseDto> {
    return this.http.get<StorageOfferResponseDto>(`${this.baseUrl}/${id}`).pipe(
      tap(data => {new StorageOfferResponseDto(data)}));
  }


  /**
   * Update an existing storage need.
   * @param id - ID of the storage need to update.
   * @param storageNeed - DTO containing updated data.
   * @returns Observable of StorageNeedResponseDto.
   */
  updateStorageOffer(id: number, storageNeed: StorageNeedCreateDto): Observable<StorageNeedResponseDto> {
    return this.http.put<StorageNeedResponseDto>(`${this.baseUrl}/${id}`, storageNeed);
  }

  /**
   * Delete a storage need by ID.
   * @param id - ID of the storage need to delete.
   * @returns Observable of void.
   */
  deleteStorageOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
