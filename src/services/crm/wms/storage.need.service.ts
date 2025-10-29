import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import {StorageNeedResponseDto} from '../../../dtos/response/crm/storage.need.response.dto';
import {StorageNeedCreateDto} from '../../../dtos/request/crm/storage.need.create.dto';
import {environment} from '../../../environments/environment';
import {StockedItemResponseDto} from '../../../dtos/response/crm/stocked.itemresponse.dto';
import {StockedItemCreateDto} from '../../../dtos/request/crm/stockedItem.create.dto';


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
    return this.http.get<StorageNeedResponseDto>(`${this.baseUrl}/${id}`).pipe(
      tap(data => {new StorageNeedResponseDto(data)}));
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

  /**
   *
   * @param storageNeedId
   * @param stockedItemRequestDto
   */
  addStockedItemToStorageNeed(storageNeedId: number, stockedItemRequestDto: StockedItemCreateDto): Observable<StockedItemResponseDto> {
    return this.http.post<StockedItemResponseDto>(
      `${this.baseUrl}/add-item-to-need/${storageNeedId}`,
      stockedItemRequestDto
    );
  }




  /**
   * Supprime un Unloading Type d'un Storage Need
   * @param storageNeedId
   * @param unloadingTypeId
   */
  removeUnloadingType(storageNeedId: number, unloadingTypeId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${storageNeedId}/unloading-type/${unloadingTypeId}`
    ).pipe(
      tap(() => console.log(`Unloading Type supprimé de StorageNeed ${storageNeedId}`)),
      catchError(error => {
        console.error('Erreur suppression unloading type:', error);
        return of('Erreur suppression unloading type');
      })
    );
  }

  /**
   * Ajoute un Unloading Type à un Storage Need
   * @param storageNeedId
   * @param unloadingTypeId
   */
  addUnloadingType(storageNeedId: number, unloadingTypeId: number): Observable<StorageNeedResponseDto> {
    return this.http.post<StorageNeedResponseDto>(
      `${this.baseUrl}/${storageNeedId}/unloading-type/${unloadingTypeId}`,
      {}
    ).pipe(
      tap(response => console.log('Unloading Type ajouté:', response)),
      catchError(error => {
        console.error('Erreur ajout unloading type:', error);
        return of({} as StorageNeedResponseDto);
      })
    );
  }

  /**
   * Ajoute une Provision à un Storage Need
   * @param storageNeedId
   * @param provisionId
   */
  addProvisionToStorageNeed(storageNeedId: number, provisionId: number): Observable<StorageNeedResponseDto> {
    return this.http.post<StorageNeedResponseDto>(
      `${this.baseUrl}/${storageNeedId}/provision/${provisionId}`,
      {}
    ).pipe(
      tap(response => console.log('Provision ajoutée:', response)),
      catchError(error => {
        console.error('Erreur ajout provision:', error);
        return of({} as StorageNeedResponseDto);
      })
    );
  }
  /**
   * Ajoute un requirement à un Storage Need
   * @param storageNeedId
   * @param requirementId
   */
  addRequirement(storageNeedId: number, requirementId: number): Observable<StorageNeedResponseDto> {
    return this.http.post<StorageNeedResponseDto>(
      `${this.baseUrl}/${storageNeedId}/requirement/${requirementId}`,
      {}
    ).pipe(
      tap(response => console.log('Requirement ajouté:', response)),
      catchError(error => {
        console.error('Erreur ajout requirement:', error);
        return of({} as StorageNeedResponseDto);
      })
    );
  }

  /**
   * Supprime un requirement d'un Storage Need
   * @param storageNeedId
   * @param requirementId
   */
  removeRequirement(storageNeedId: number, requirementId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${storageNeedId}/requirement/${requirementId}`
    ).pipe(
      tap(() => console.log(`Requirement supprimé de StorageNeed ${storageNeedId}`)),
      catchError(error => {
        console.error('Erreur suppression requirement:', error);
        return of('Erreur suppression requirement');
      })
    );
  }


  /**
   * Delete a stocked item and its provisions from a storage need
   * @param storageNeedId
   * @param stockedItemId
   */
  removeStockedItem(storageNeedId: number, stockedItemId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${storageNeedId}/stocked-item/${stockedItemId}`
    ).pipe(
      tap(() => console.log(`Stocked item deleted from StorageNeed ${storageNeedId}`)),
      catchError(error => {
        console.error('Error deleting stocked item:', error);
        return of('Error deleting stocked item');
      })
    );
  }

  /**
   * this function allows to check storage need has offers or not
   * @param storageNeedId the storage need id
   */
  checkIfStorageNeedHasOffer(storageNeedId: number): Observable<boolean>{
    return this.http.get<boolean>(`${this.baseUrl}/has-offer/${storageNeedId}`)
  }
}
