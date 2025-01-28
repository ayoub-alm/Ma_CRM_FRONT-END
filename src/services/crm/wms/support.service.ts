import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';
import {SupportResponseDto} from '../../../dtos/response/crm/support.response.dto';

@Injectable({
  providedIn: 'root'
})
export class SupportService{
  private readonly baseUrl: string = environment.baseUrl + "/api/supports";

  constructor(private http: HttpClient) {}

  /**
   * This function allows to get all supports (conditionment) by company ID
   * @param companyId the id of the current company
   * @return {Observable<SupportResponseDto[]>} list of support DTO
   */
  getAllSupportsByCompanyId(companyId: number): Observable<SupportResponseDto[]> {
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<SupportResponseDto[]>(`${this.baseUrl}`, {params}).pipe(
      tap((response: SupportResponseDto[]) => {
       new SupportResponseDto(response)
    }));
  }
}
