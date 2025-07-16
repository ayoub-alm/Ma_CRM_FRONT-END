import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProvisionResponseDto} from '../../../dtos/response/crm/provision.response.dto';
import {ProvisionRequestDto} from '../../../dtos/init_data/request/provision.request.dto';

@Injectable({
  providedIn: 'root'
})
export class ProvisionService {
  private baseUrl: string = `${environment.baseUrl}/api/provisions`; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  /**
   * Fetch all provisions
   * @returns Observable of ProvisionResponseDto array
   */
  getAllProvisionsByCompanyId(companyId: number): Observable<ProvisionResponseDto[]> {
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<ProvisionResponseDto[]>(this.baseUrl,{params}).pipe(tap((response: ProvisionResponseDto[]) => {
      response.map(provision => new ProvisionResponseDto(provision))
        .sort((a,b)=> a.order - b.order);
    }));
  }

  /**
   * Fetch a single provision by ID
   * @param id Provision ID
   * @returns Observable of ProvisionResponseDto
   */
  getProvisionById(id: number): Observable<ProvisionResponseDto> {
    return this.http.get<ProvisionResponseDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new provision
   * @param provision ProvisionResponseDto object
   * @returns Observable of created ProvisionResponseDto
   */
  createProvision(provision: ProvisionRequestDto): Observable<ProvisionResponseDto> {
    return this.http.post<ProvisionResponseDto>(this.baseUrl, provision);
  }

  /**
   * Update an existing provision
   * @param provision ProvisionResponseDto object with updated data
   * @returns Observable of updated ProvisionResponseDto
   */
  updateProvision(provision: ProvisionRequestDto): Observable<ProvisionResponseDto> {
    return this.http.put<ProvisionResponseDto>(`${this.baseUrl}`, provision);
  }

  /**
   * Delete a provision by ID
   * @param id Provision ID
   * @returns Observable of void
   */
  deleteProvision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


  /**
   * Remove a provision from a stocked item.
   * @param stockedItemId - ID of the stocked item
   * @param provisionId - ID of the provision to remove
   * @returns Observable<boolean>
   */
  removeProvisionFromStockedItem(stockedItemId: number, provisionId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/stocked-item/${stockedItemId}/provision/${provisionId}`);
  }

  /**
   * this function allows to add new PROVISION to stocked item
   * @param stockedItemId
   * @param provisionId
   */
  addProvisionToStockedItem(stockedItemId: number, provisionId: number): Observable<boolean>{
    return this.http.post<boolean>(`${this.baseUrl}/add-to-stocked-item/${stockedItemId}/provision/${provisionId}`, {});
  }

  /**
   * This function allows as to mark provision as storage price
   * @param provisionId provision Id
   */
  markProvisionAsStoragePrice(provisionId: number): Observable<ProvisionResponseDto>{
    return this.http.get<ProvisionResponseDto>(`${this.baseUrl}/mark-provision-as-storage-price/${provisionId}`);
  }
}
