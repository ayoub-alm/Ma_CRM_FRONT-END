import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import {StorageNeedResponseDto} from '../../../dtos/response/crm/storage.need.response.dto';
import {StorageNeedCreateDto} from '../../../dtos/request/crm/storage.need.create.dto';
import {environment} from '../../../environments/environment';
import {StorageOfferCreateDto} from '../../../dtos/request/crm/storage.offer.create.dto';
import {StorageOfferModel} from '../../../models/storage.offer.model';
import {StorageOfferResponseDto} from '../../../dtos/response/crm/storage.offer.response.dto';
import {StockedItemCreateDto} from '../../../dtos/request/crm/stockedItem.create.dto';
import {StockedItemResponseDto} from '../../../dtos/response/crm/stocked.itemresponse.dto';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';
import {RequirementResponseDto} from '../../../dtos/response/crm/requirement.response.dto';
import {StorageOfferUpdateRequestDto} from '../../../dtos/request/crm/storage.offer.update.request.dto';


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
   * This function allows to create Storage offer from need by need ID
   * @param needId the need id
   * @retrun {Observable<StorageOfferModel>} created Storage Offer
   */
  createStorageOfferFormNeedId(needId: number): Observable<StorageOfferModel> {
    return this.http.post<StorageOfferModel>(`${this.baseUrl}/create-from-need/${needId}`, {});
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
   * Update an existing storage Offer.
   * @param storageOffer - DTO containing updated data.
   * @returns Observable of StorageNeedResponseDto.
   */
  updateStorageOffer(offerId: number,storageOffer: StorageOfferUpdateRequestDto): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(`${this.baseUrl}/update/${offerId}`, storageOffer);
  }

  /**
   * Delete a storage need by ID.
   * @param id - ID of the storage need to delete.
   * @returns Observable of void.
   */
  deleteStorageOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }




  /**
   * This function allows to add stocked item to storage Offer
   * @param storageOfferId
   * @param stockedItemRequestDto
   */
  addStockedItemToStorageOffer(storageOfferId: number, stockedItemRequestDto: StockedItemCreateDto): Observable<StockedItemResponseDto> {
    return this.http.post<StockedItemResponseDto>(
      `${this.baseUrl}/add-item-to-need/${storageOfferId}`,
      stockedItemRequestDto
    );
  }

  /**
   * this function allows to deleted stocked item and provisions from offer
   * @param storageOfferId
   * @param stockedItemId
   */
  deleteStockedItemFromOffer(storageOfferId: number, stockedItemId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${storageOfferId}/stocked-item/${stockedItemId}`
    ).pipe(
      tap(() => console.log(`Stocked item deleted from StorageNeed ${storageOfferId}`)),
      catchError(error => {
        console.error('Error deleting stocked item:', error);
        return of('Error deleting stocked item');
      })
    );
  }

  /**
   * This function allows to delete unloading type from storage offer
   * @param storageOfferId
   * @param unloadingTypeId
   */
  removeUnloadingType(storageOfferId: number, unloadingTypeId: number) : Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${storageOfferId}/unloading-type/${unloadingTypeId}`
    ).pipe(
      tap(() => console.log(`Unloading Type supprimé de StorageNeed ${storageOfferId}`)),
      catchError(error => {
        console.error('Erreur suppression unloading type:', error);
        return of('Erreur suppression unloading type');
      })
    );
  }

  /**
   * This function allows to add unloading type to storage need
   * @param storageOfferId
   * @param unloadingTypeId
   */
  addUnloadingType(storageOfferId: number, unloadingTypeId: number):Observable<StorageOfferResponseDto> {
    return this.http.post<StorageOfferResponseDto>(
      `${this.baseUrl}/${storageOfferId}/unloading-type/${unloadingTypeId}`, {}).pipe(
      catchError(error => {
        console.error('Erreur ajout unloading type:', error);
        return of({} as StorageOfferResponseDto);
      })
    );
  }

  updateStorageOfferUnloadingType(storageOfferUnloadTypeId:number, storageOfferUnloadType: UnloadingTypeResponseDto): Observable<Boolean>{
    return this.http.put<Boolean>(`${this.baseUrl}/update-storage-offer-unloadingType/${storageOfferUnloadTypeId}`,storageOfferUnloadType)
  }

  updateStorageOfferRequirement(storageOfferRequirementId:number, storageOfferRequirement: RequirementResponseDto): Observable<Boolean>{
    return this.http.put<Boolean>(`${this.baseUrl}/update-storage-offer-requirement/${storageOfferRequirementId}`,storageOfferRequirement)
  }

  /**
   * add requirement to storage Offer
   * @param storageOfferId
   * @param requirementId
   */
  addRequirementToStorageOffer(storageOfferId: number, requirementId: number): Observable<StorageOfferResponseDto> {
    return this.http.post<StorageOfferResponseDto>(
      `${this.baseUrl}/${storageOfferId}/requirement/${requirementId}`,
      {}
    )
  }

  /**
   * Delete requirement from storage Offer
   * @param storageOfferId
   * @param requirementId
   */
  removeRequirement(storageOfferId: number, requirementId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${storageOfferId}/requirement/${requirementId}`
    ).pipe(
      tap(() => console.log(`Requirement supprimé ${storageOfferId}`)),
      catchError(error => {
        console.error('Erreur suppression requirement:', error);
        return of('Erreur suppression requirement');
      })
    );
  }

  /**
   *
   * @param storageOfferId
   * @param managementFees
   */
  updateManagementFees(storageOfferId: number, managementFees: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/update-management-fees/${storageOfferId}`,
      { managementFees } // Sending as an object for better consistency
    );
  }

  /**
   * update Storage offer status
   * @param storageOfferId
   * @param note
   */
  updateNote(storageOfferId: number, note: string): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/update-note/${storageOfferId}`,
      { note } // Sending as an object for better consistency
    );
  }

  updateDevise(storageOfferId: number, devise: string): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/update-devise/${storageOfferId}`,
      { devise } // Sending as an object for better consistency
    );
  }

  /**
   * update storage offer status to awaiting opprovement
   * @param storageOfferId
   */
  sendOfferToValidationById(storageOfferId: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/send-to-validate/${storageOfferId}`,{} );
  }


  validateOfferById(storageOfferId: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/validate/${storageOfferId}`, {}
    );
  }

  sendOfferById(storageOfferId: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/send/${storageOfferId}`, {}
    );
  }

  acceptOfferById(storageOfferId: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/accepted/${storageOfferId}`, {}
    );
  }

  refuseOfferById(storageOfferId: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/refused/${storageOfferId}`, {}
    );
  }

  /**
   * this function allows to update max discount Value for storage offer
   * @param storageOfferId
   * @param maxValue
   */
  updateMaxDiscountValue(storageOfferId: number, maxValue: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/update-max-discount-value/${storageOfferId}`,maxValue
    );
  }

  /**
   *
   * @param storageOfferId
   * @param selectMethodId
   */
  updateSelectedPaymentMethod(storageOfferId: number, selectMethodId: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/update-selected-payment-method/${storageOfferId}/${selectMethodId}`,{}
    );
  }

  /**
   * This function allows to update minimal billing for storage offer
   * @param storageOfferId storage offer ID
   * @param minimalBilling minimal billing amount
   */
  updateMinimalBillingAmount(storageOfferId: number, minimalBilling: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/update-minimal-billing/${storageOfferId}`,minimalBilling );
  }

  updateReservedPlaces(storageOfferId: number, numberOfPlaces: number): Observable<StorageOfferResponseDto> {
    return this.http.put<StorageOfferResponseDto>(
      `${this.baseUrl}/update-reserved-places/${storageOfferId}`,numberOfPlaces );
  }


}
