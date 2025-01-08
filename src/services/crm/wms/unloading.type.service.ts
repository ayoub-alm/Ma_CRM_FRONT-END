import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';

@Injectable({providedIn: 'root'})
export class  UnloadingTypeService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}


  getUnloadingTypeByCompanyId(companyId: number): Observable<UnloadingTypeResponseDto[]> {
      const params = new HttpParams().set('companyId', companyId);
      return this.http.get<UnloadingTypeResponseDto[]>(`${this.baseUrl}/api/unloading-types`, {params}).pipe(tap(unloadingTypes => {
        return unloadingTypes.map(unloadingType => {new UnloadingTypeResponseDto(unloadingType)});
      }));
  }
}
