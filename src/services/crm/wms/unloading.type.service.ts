import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';
import {UnloadingRequestDto} from '../../../dtos/init_data/request/unloading.request.dto';

@Injectable({providedIn: 'root'})
export class  UnloadingTypeService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  /**
   * this function allows to get unloading types by company id
   * @param companyId the id Of the current company
   * @return {Observable<UnloadingTypeResponseDto[]>} list of unloading types
   */
  getUnloadingTypeByCompanyId(companyId: number): Observable<UnloadingTypeResponseDto[]> {
      const params = new HttpParams().set('companyId', companyId);
      return this.http.get<UnloadingTypeResponseDto[]>(`${this.baseUrl}/api/unloading-types`, {params}).pipe(tap(unloadingTypes => {
        return unloadingTypes.map(unloadingType => {new UnloadingTypeResponseDto(unloadingType)});
      }));
  }

  /**
   * this function allows to create new Unloading type
   * @param unloading
   */
  createUnloadingType(unloading: UnloadingRequestDto): Observable<UnloadingTypeResponseDto> {
     return this.http.post<UnloadingTypeResponseDto>(`${this.baseUrl}/api/unloading-types`, unloading).pipe(
       tap(unloadingType => {new UnloadingTypeResponseDto(unloadingType)})
     )
  }

  /**
   * this function allows to update unloading types
   * @param unloading
   */
  updateUnloadingType(unloading: UnloadingRequestDto): Observable<UnloadingTypeResponseDto> {
    return this.http.put<UnloadingTypeResponseDto>(`${this.baseUrl}/api/unloading-types`, unloading).pipe(
      tap(unloadingType => {new UnloadingTypeResponseDto(unloadingType)})
    )
  }



}
