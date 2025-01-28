import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';
import {SupportResponseDto} from '../../../dtos/response/crm/support.response.dto';
import {StructureResponseDto} from '../../../dtos/response/crm/structure.response.dto';

@Injectable({
  providedIn: 'root'
})
export class StructureService{
  private readonly baseUrl: string = environment.baseUrl + "/api/structures";

  constructor(private http: HttpClient) {}

  /**
   * This function allows to get all structures by company ID
   * @param companyId the id of the current company
   * @return {Observable<SupportResponseDto[]>} list of structures DTO
   */
  getAllStructuresByCompanyId(companyId: number): Observable<StructureResponseDto[]> {
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<StructureResponseDto[]>(`${this.baseUrl}`, {params}).pipe(
      tap((response: StructureResponseDto[]) => {
       new StructureResponseDto(response)
    }));
  }
}
