import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {StorageNeedResponseDto} from '../../../dtos/response/crm/storage.need.request.dto';
import {StorageNeedCreateDto} from '../../../dtos/request/crm/storage.need.create.dto';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class StorageNeedService {
  private readonly baseUrl: string = environment.baseUrl + "/api/wms/needs"; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  /**
   * Fetch all storage needs by company ID.
   * @param companyId - ID of the company.
   * @returns Observable of StorageNeedResponseDto[].
   */
  getAllStorageNeedsByCompanyId(companyId: number): Observable<StorageNeedResponseDto[]> {
    return this.http.get<StorageNeedResponseDto[]>(`${this.baseUrl}?companyId=${companyId}`);
  }

  /**
   * Fetch a single storage need by ID.
   * @param id - ID of the storage need.
   * @returns Observable of StorageNeedResponseDto.
   */
  getStorageNeedById(id: number): Observable<StorageNeedResponseDto> {
    return this.http.get<StorageNeedResponseDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new storage need.
   * @param storageNeed - DTO containing data for the new storage need.
   * @returns Observable of StorageNeedResponseDto.
   */
  createStorageNeed(storageNeed: StorageNeedCreateDto): Observable<StorageNeedResponseDto> {
    return this.http.post<StorageNeedResponseDto>(this.baseUrl, storageNeed);
  }

  /**
   * Update an existing storage need.
   * @param id - ID of the storage need to update.
   * @param storageNeed - DTO containing updated data.
   * @returns Observable of StorageNeedResponseDto.
   */
  updateStorageNeed(id: number, storageNeed: StorageNeedCreateDto): Observable<StorageNeedResponseDto> {
    return this.http.put<StorageNeedResponseDto>(`${this.baseUrl}/${id}`, storageNeed);
  }

  /**
   * Delete a storage need by ID.
   * @param id - ID of the storage need to delete.
   * @returns Observable of void.
   */
  deleteStorageNeed(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
