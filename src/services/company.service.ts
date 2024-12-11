import {Injectable} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {CreateCompanyRequest} from "../dtos/request/CreateCompanyDto";
import {CompanyResponseDto} from "../dtos/response/CompanyResponseDto";
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  createCompany(newCompanies: CreateCompanyRequest): Observable<CreateCompanyRequest> {
    return this.http.post<CreateCompanyRequest>(`${this.baseUrl}/api/companies`, newCompanies)
  }

  getAllCompanies(): Observable<CompanyResponseDto[]> {
    return this.http.get<CompanyResponseDto[]>(`${this.baseUrl}/api/companies`).pipe(
      tap(companyResponseDtos => {
        companyResponseDtos.map(companyResponseDto => {new CompanyResponseDto(companyResponseDto)});
      })
    )
  }

  getCompanyById(companyId: number): Observable<CompanyResponseDto> {
    return this.http.get<CompanyResponseDto>(`${this.baseUrl}/api/companies/${companyId}`).pipe(
      tap(companyResponseDto => {
        new CompanyResponseDto(companyResponseDto);
      })
    )
  }

  deleteCompanyById(companyId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/api/companies/${companyId}`)
  }
}
