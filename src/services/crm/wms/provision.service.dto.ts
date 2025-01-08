import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProvisionResponseDto} from '../../../dtos/response/crm/provision.response.dto';

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
      response.map(provision => new ProvisionResponseDto(provision));
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
  createProvision(provision: ProvisionResponseDto): Observable<ProvisionResponseDto> {
    return this.http.post<ProvisionResponseDto>(this.baseUrl, provision);
  }

  /**
   * Update an existing provision
   * @param id Provision ID
   * @param provision ProvisionResponseDto object with updated data
   * @returns Observable of updated ProvisionResponseDto
   */
  updateProvision(id: number, provision: ProvisionResponseDto): Observable<ProvisionResponseDto> {
    return this.http.put<ProvisionResponseDto>(`${this.baseUrl}/${id}`, provision);
  }

  /**
   * Delete a provision by ID
   * @param id Provision ID
   * @returns Observable of void
   */
  deleteProvision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
