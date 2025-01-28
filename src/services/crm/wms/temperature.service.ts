import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';
import {SupportResponseDto} from '../../../dtos/response/crm/support.response.dto';
import {TemperatureResponseDto} from '../../../dtos/response/crm/temperature.response.dto';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService{
  private readonly baseUrl: string = environment.baseUrl + "/api/temperatures";

  constructor(private http: HttpClient) {}

  /**
   * This function allows to get all temperatures by company ID
   * @param companyId the id of the current company
   * @return {Observable<TemperatureResponseDto[]>} list of temperatures DTO
   */
  getAllTemperaturesByCompanyId(companyId: number): Observable<TemperatureResponseDto[]> {
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<TemperatureResponseDto[]>(`${this.baseUrl}`, {params}).pipe(
      tap((response: TemperatureResponseDto[]) => {
       new TemperatureResponseDto(response)
    }));
  }
}
