import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';
import {StorageManagementFeesResponseDto} from '../../../dtos/response/crm/storage.management.fees.response.dto';

@Injectable({providedIn: 'root'})
export class  StorageManagementFeesService {
  private readonly baseUrl: string = environment.baseUrl + "/api/storage-management-fees";
  constructor(private http: HttpClient) {}

  /**
   * this Function allows to gel storage management fees by company id
   * @param companyId the id of the company
   * @return Observable<StorageManagementFeesResponseDto[]> list of management fees
   */
  getManagementFeesByCompanyId(companyId: number): Observable<StorageManagementFeesResponseDto[]> {
      return this.http.get<StorageManagementFeesResponseDto[]>(`${this.baseUrl}/${companyId}`).pipe(
        tap(storageManagementFees => {
        return storageManagementFees.map(storageManagementFee => {
          new StorageManagementFeesResponseDto(storageManagementFee)});
      }));
  }
}
