import {Injectable} from "@angular/core";

import {HttpClient, HttpParams, HttpRequest} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {environment} from '../../environments/environment';
import {ProspectResponseDto} from '../../dtos/response/prospect.response.dto';
import {InterestResponseDto} from "../../dtos/response/interestResponseDto";
import {ProspectFilterRequestDto} from '../../dtos/filters/prospectFilterRequestDto';
import {BulkCustomerEditRequestDto} from '../../dtos/request/leads/bluk.edit.customers.dto';
import { CreateProspectDto } from "../../dtos/request/leads/CreateProspectDto";


@Injectable({
  providedIn: 'root'
})

export class ProspectService {
  private readonly baseUrl: string = environment.baseUrl+'/api/prospects';
  constructor(private http: HttpClient) {}

  /**
   * this function allows to create new prospect
   * @param newCustomer
   */
  createCustomer(newCustomer: CreateProspectDto): Observable<CreateProspectDto> {
    return this.http.post<CreateProspectDto>(`${this.baseUrl}`, newCustomer)
  }

  /**
   * This function allows to get all customer by company ID
   * @param companyId the id of the current company
   * @return Observable<ProspectResponseDto[]> list of costumers
   */
  getAllCustomers(companyId:number): Observable<ProspectResponseDto[]> {
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<ProspectResponseDto[]>(`${this.baseUrl}` , {params}).pipe(
      tap(ProspectResponseDtos => {
        ProspectResponseDtos.map(prospectResponseDto => {new ProspectResponseDto(ProspectResponseDto)});
      })
    )
  }

  /**
   * This function allows to get customer by ID
   * @param customerId The id of customer
   * @return Observable<ProspectResponseDto> customer response
   */
  getCustomerById(customerId: number): Observable<ProspectResponseDto> {
    return this.http.get<ProspectResponseDto>(`${this.baseUrl}/${customerId}`).pipe(
      tap(prospectResponseDto => {
        new ProspectResponseDto(ProspectResponseDto);
      })
    )
  }

  /**
   * this function allows to delete customer by ID
   * @param customerId the id of customer
   */
  deleteProspectById(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/soft-delete/${customerId}`)
  }

  /**
   * This function allows to soft-delete a group of customers
   * @param customersIds the customers IDs
   * @return Observable<boolean>
   */
  bulkSoftDelete(customersIds: number[]): Observable<boolean>{
    return this.http.post<boolean>(`${this.baseUrl}/soft-delete/bulk`, customersIds)
  }


  /**
   * Upload an Excel file to the backend.
   * @param file The file to upload.
   * @param companyId
   * @returns Observable with the server's response.
   */
  uploadFile(file: File, companyId: number): Observable<ProspectResponseDto[]> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId.toString());
    return this.http.post<ProspectResponseDto[]>(`${this.baseUrl}/import-from-excel`, formData).pipe(
      tap(data => {
          return data
    }));
  }

  /**
   * Update the status of a prospect.
   * @param customerId - The ID of the prospect to update.
   * @param statusId - The new status to apply.
   * @returns An observable of the updated Prospect object.
   */
  updateCustomerStatus(customerId: number, statusId: number): Observable<ProspectResponseDto> {
    const params = { prospectId: customerId.toString(),statusId: statusId };
    return this.http.put<ProspectResponseDto>(`${this.baseUrl}/status`, null, { params });
  }

  /**
   * this function allows to get interests by company ID
   * @param companyId
   */
  getInterestByCompanyId(companyId: number): Observable<InterestResponseDto[]> {
      return this.http.get<InterestResponseDto[]>(`${environment.baseUrl}/api/interests/company/${companyId}`).pipe(
          tap(interestResponseDtos => {
                interestResponseDtos.map(interestResponseDto => {new InterestResponseDto(InterestResponseDto)});
          })
      )
  }

  /**
   * Adds an interest to a customer.
   *
   * @param customerId The ID of the customer.
   * @param interestId The ID of the interest.
   * @returns Observable containing the API response.
   */
  addInterestToCustomer(customerId: number, interestId: number): Observable<string> {
    return this.http.post<string>(`${environment.baseUrl}/api/interests/${customerId}/interests/${interestId}`, {});
  }

  /**
   * Removes an interest from a customer.
   *
   * @param customerId The ID of the customer.
   * @param interestId The ID of the interest.
   * @returns Observable containing the API response.
   */
  removeInterestFromCustomer(customerId: number, interestId: number): Observable<string> {
    return this.http.delete<string>(`${environment.baseUrl}/api/interests/${customerId}/interests/${interestId}`);
  }

  /**
   *
   * @param prospectId
   * @param formData
   */
  updateProspectLogo(prospectId: number, formData: FormData): Observable<ProspectResponseDto> {
    const url = `${this.baseUrl}/update-logo`;
    return this.http.put<ProspectResponseDto>(url, formData, { params: { prospectId: prospectId.toString() } });
  }

  /**
   * Get prospect by filter
   * @param prospectFilterRequestDto
   */
  getProspectByFilter(prospectFilterRequestDto: ProspectFilterRequestDto) {
    return this.http.post<ProspectResponseDto[]>(`${this.baseUrl}/filter-by-fields`, prospectFilterRequestDto);
  }

  /**
   * Bulk edit customers
   * @param request
   */
  bulkEditCustomers(request: BulkCustomerEditRequestDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/bulk-edit`, request);
  }


  /**
   * This function allows to get customers by company ID and search Keyword
   * @param searchKeyword the search Keyword
   * @param companyId the id of the current company
   */
  getCustomerBySearchValueAndCompanyId(searchKeyword: string, companyId: number): Observable<ProspectResponseDto[]>{
    let params = new HttpParams().set('companyId', companyId).set('q', searchKeyword);
    return this.http.get<ProspectResponseDto[]>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Exports customer data to an Excel file for the specified company.
   * Optionally filters the data by a list of selected customer IDs.
   *
   * @param {number} companyId - The ID of the company for which the data is being exported.
   * @param {number[]} [selectedCustomerIds=[]] - An optional array of customer IDs to filter the exported data.
   * @return {Observable<Blob>} An observable that resolves to a Blob containing the Excel file data.
   */
  exportExcelFile(companyId: number, selectedCustomerIds: number[] = []) {
    const params = { companyId: companyId.toString() };
    return this.http.post(`${this.baseUrl}/export`, selectedCustomerIds, {
      responseType: 'blob',
      params: params
    });
  }

  /**
   * download excel template to import prospect
   * @param currentCompanyId
   */
  downloadCustomerExcelTemplate(currentCompanyId: number): Observable<Blob> {
    const params = new HttpParams().set('companyId', currentCompanyId);
    return this.http.get(`${this.baseUrl}/export-excel-template`, { params, responseType: 'blob' });
  }
}
