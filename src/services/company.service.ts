import {Injectable} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {CreateCompanyRequest} from "../dtos/request/CreateCompanyDto";
import {CompanyResponseDto} from "../dtos/response/CompanyResponseDto";
import {environment} from '../environments/environment';
import {CompanyModel} from "../app/models/super-admin/company.model";
import {CompanyMapper} from "../app/mappers/super-admin_mappers/company.mappers";

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  private readonly baseUrl: string = environment.baseUrl +'/api/companies';
  constructor(private http: HttpClient) {}

  /**
   * Use Mapper toDto to convert Model to requestDto
   * @param newCompany
   */
  createCompany(newCompany: CompanyModel): Observable<CompanyResponseDto> {
    const company = CompanyMapper.toDto(newCompany);
    return this.http.post<CompanyResponseDto>(`${this.baseUrl}`, company).pipe(
      map(response => new CompanyResponseDto(response))
    )
  }

  /**
   *
   * @param companyId
   * @param newCompany
   */
  updateCompany(companyId: number ,newCompany: CompanyModel): Observable<CompanyResponseDto> {
    const company = CompanyMapper.toDto(newCompany);
    return this.http.put<CompanyResponseDto>(`${this.baseUrl}/${companyId}`, company).pipe(
      map(response => new CompanyResponseDto(response))
    )
  }

  getAllCompanies(): Observable<CompanyResponseDto[]> {
    return this.http.get<CompanyResponseDto[]>(`${this.baseUrl}`).pipe(
      tap(companyResponseDtos => {
        companyResponseDtos.map(companyResponseDto => {new CompanyResponseDto(companyResponseDto)});
      })
    )
  }

  /**
   *
   * @param companyId
   */
  getCompanyById(companyId: number): Observable<CompanyModel> {
    return this.http.get<CompanyResponseDto>(`${this.baseUrl}/${companyId}`).pipe(
        map(companyResponseDto => CompanyMapper.fromDto(companyResponseDto))
    );
  }


  deleteCompanyById(companyId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${companyId}`)
  }

  updateCompanyLogo(companyId: number, formData: FormData): Observable<CompanyResponseDto> {
    return this.http.put<CompanyResponseDto>(`${this.baseUrl}/companylogo/${companyId}`, formData).pipe(
        tap(response => {
          new CompanyResponseDto(CompanyResponseDto);
        })
    )
  }

}
