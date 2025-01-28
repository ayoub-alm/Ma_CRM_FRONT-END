import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';
import {RequirementResponseDto} from '../../../dtos/response/crm/requirement.response.dto';

@Injectable({providedIn: 'root'})
export class  RequirementService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}


  getRequirementsByCompanyId(companyId: number): Observable<RequirementResponseDto[]> {
      const params = new HttpParams().set('companyId', companyId);
      return this.http.get<RequirementResponseDto[]>(`${this.baseUrl}/api/storage-requirements`, {params}).pipe(
        tap(requirements => {
        return requirements.map(requirement => {new RequirementResponseDto(requirement)});
      }));
  }
}
