import {Injectable} from "@angular/core";

import {HttpClient, HttpRequest} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {CreateCompanyRequest} from "../../dtos/request/CreateCompanyDto";
import {environment} from '../../environments/environment';
import {ProspectResponseDto} from '../../dtos/response/prospect.response.dto';
import {CreateProspectDto} from '../../dtos/request/CreateProspectDto';
import {InterestResponseDto} from "../../dtos/response/interestResponseDto";
import {interestRequestDto} from "../../dtos/request/interestRequestDto";
import {ProspectInterestResponseDto} from "../../dtos/response/prospectInterestResponseDto";

@Injectable({
  providedIn: 'root'
})

export class ProspectService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  createProspect(newProspects: CreateProspectDto): Observable<CreateProspectDto> {
    return this.http.post<CreateProspectDto>(`${this.baseUrl}/api/prospects`, newProspects)
  }

  getAllProspects(): Observable<ProspectResponseDto[]> {
    return this.http.get<ProspectResponseDto[]>(`${this.baseUrl}/api/prospects`).pipe(
      tap(ProspectResponseDtos => {
        ProspectResponseDtos.map(prospectResponseDto => {new ProspectResponseDto(ProspectResponseDto)});
      })
    )
  }

  getProspectById(prospectId: number): Observable<ProspectResponseDto> {
    return this.http.get<ProspectResponseDto>(`${this.baseUrl}/api/prospects/${prospectId}`).pipe(
      tap(prospectResponseDto => {
        new ProspectResponseDto(ProspectResponseDto);
      })
    )
  }

  deleteProspectById(prospectId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/prospects/${prospectId}`)
  }

  /**
   * Upload an Excel file to the backend.
   * @param file The file to upload.
   * @returns Observable with the server's response.
   */
  uploadFile(file: File): Observable<ProspectResponseDto[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ProspectResponseDto[]>(`${this.baseUrl}/api/prospects/import-from-excel`, formData).pipe(
      tap(data => {
          return data
    }));
  }

  /**
   * Update the status of a prospect.
   * @param prospectId - The ID of the prospect to update.
   * @param status - The new status to apply.
   * @returns An observable of the updated Prospect object.
   */
  updateProspectStatus(prospectId: number, status: string): Observable<ProspectResponseDto> {
    const url = `${this.baseUrl}/api/prospects/status`;

    // Set up query parameters
    const params = { prospectId: prospectId.toString(), status };

    // Perform the PUT request
    return this.http.put<ProspectResponseDto>(url, null, { params });
  }

  /**
   *
   * @param companyId
   */
  getInterestByCompanyId(companyId: number): Observable<InterestResponseDto[]> {
      return this.http.get<InterestResponseDto[]>(`${this.baseUrl}/api/interests/company/${companyId}`).pipe(
          tap(interestResponseDtos => {
                interestResponseDtos.map(interestResponseDto => {new InterestResponseDto(InterestResponseDto)});
          })
      )
  }

  /**
   * Update the status of an interest.
   * @param interest - The ID of the interest to update.
   */
  updateInterest(interest: interestRequestDto): Observable<ProspectInterestResponseDto> {
      // const requestBody = new HttpRequestB()
    alert(30)
      return this.http.put<ProspectInterestResponseDto>(
          `${this.baseUrl}/api/prospects-interests` , interest).pipe(
        tap(interestRequestDto => {
          new ProspectInterestResponseDto(ProspectInterestResponseDto)})
    )
  }
}
