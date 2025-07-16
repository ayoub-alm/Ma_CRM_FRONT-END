import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {UnloadingTypeResponseDto} from '../../../dtos/response/crm/unloading.type.response.dto';
import {RequirementResponseDto} from '../../../dtos/response/crm/requirement.response.dto';
import {RequirementRequestDto} from '../../../dtos/init_data/request/requirment.request.dto';

@Injectable({providedIn: 'root'})
export class  RequirementService {
  private readonly baseUrl: string = environment.baseUrl+'/api/storage-requirements';
  constructor(private http: HttpClient) {}

  /**
   * This function allows to get all requirement by company ID
   * @param companyId the id of the current selected company
   * @return Observable<RequirementResponseDto[]> array of requirements
   */
  getRequirementsByCompanyId(companyId: number): Observable<RequirementResponseDto[]> {
      const params = new HttpParams().set('companyId', companyId);
      return this.http.get<RequirementResponseDto[]>(`${this.baseUrl}`, {params}).pipe(
        tap(requirements => {
        return requirements.map(requirement => {new RequirementResponseDto(requirement)});
      }));
  }

  /**
   * this function allows to create a new requirement
   * @param requirement
   * @return Observable<RequirementResponseDto>
   */
  createRequirement(requirement: RequirementRequestDto): Observable<RequirementResponseDto> {
    return this.http.post<RequirementResponseDto>(`${this.baseUrl}`, requirement)
  }

  updateRequirement(requirement: RequirementRequestDto): Observable<RequirementResponseDto> {
    return this.http.put<RequirementResponseDto>(`${this.baseUrl}`, requirement)
  }
}
