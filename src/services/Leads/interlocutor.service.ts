import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, tap} from 'rxjs';
import {InterlocutorRequestDto} from '../../dtos/request/leads/interlocutorRequestDto';
import {InterlocutorResDto} from '../../dtos/response/interlocutor.dto';
import {InterlocutorsFilterRequestDto} from '../../dtos/filters/interlocutorFilterRequestDto';

@Injectable({
  providedIn: 'root'
})

export class InterlocutorService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  /**
   * Fetches all interlocutors associated with a specific company ID, optionally filtered by a search value.
   *
   * @param {number} companyId - The unique ID of the company for which to fetch interlocutors.
   * @param {string} [searchValue] - Optional search term to filter the interlocutors by. Defaults to an empty string.
   * @return {Observable<InterlocutorResDto[]>} An observable that emits a list of InterlocutorResDto objects.
   */
  getAllInterlocutorsByCompanyId(companyId:number, searchValue: string = "", page?: number, pageSize?: number): Observable<InterlocutorResDto[]>{
    let params = new HttpParams().set('companyId', companyId.toString()).set('searchValue', searchValue.toString());
    if (page !== undefined) params = params.set('page', page);
    if (pageSize !== undefined) params = params.set('pageSize', pageSize);
    return this.http.get<InterlocutorResDto[]>(`${this.baseUrl}/api/interlocutors`, {params}).pipe(
      tap((interlocutors: InterlocutorResDto[]) => {
      interlocutors.map((interlocutor: InterlocutorResDto) => {
        new InterlocutorResDto(interlocutor)
      })
    }))
  }

  /**
   * Retrieves a list of interlocutors associated with a given prospect ID.
   *
   * @param {number} prospectId - The unique identifier of the prospect.
   * @return {Observable<InterlocutorResDto[]>} An observable that emits an array of InterlocutorResDto objects.
   */
  getInterlocutorsByProspectId(prospectId: number, page?: number, pageSize?: number): Observable<InterlocutorResDto[]>{
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page);
    if (pageSize !== undefined) params = params.set('pageSize', pageSize);
    return this.http.get<InterlocutorResDto[]>(`${this.baseUrl}/api/interlocutors/prospect/${prospectId}`, { params }).pipe(tap((interlocutors: InterlocutorResDto[]) => {
      interlocutors.map((interlocutor: InterlocutorResDto) => {
        new InterlocutorResDto(interlocutor)
      })
    }))
  }

  /**
   * Retrieves an interlocutor by their unique identifier.
   *
   * @param {number} id - The unique identifier of the interlocutor to retrieve.
   * @return {Observable<InterlocutorResDto>} An observable that emits the data of the fetched interlocutor.
   */
  getInterlocutorById(id: number): Observable<InterlocutorResDto>{
    return this.http.get<InterlocutorResDto>(`${this.baseUrl}/api/interlocutors/${id}`).pipe(
      tap((interlocutor: InterlocutorResDto) => {
        new InterlocutorResDto(interlocutor)
    }))
  }

  /**
   * Creates a new interlocutor by sending a POST request to the API.
   *
   * @param {InterlocutorRequestDto} interlocutor - The data transfer object containing details of the interlocutor to be created.
   * @return {Observable<InterlocutorResDto>} An observable that emits the created interlocutor's response data transfer object.
   */
  createInterlocutor(interlocutor: InterlocutorRequestDto): Observable<InterlocutorResDto> {
    return this.http.post<InterlocutorResDto>(`${this.baseUrl}/api/interlocutors`, interlocutor).pipe(
      tap((interlocutor: InterlocutorResDto) => {
      new InterlocutorResDto(interlocutor)
    }))
  }

  /**
   * Updates an existing interlocutor with the given ID and new data.
   *
   * @param {number} id - The unique identifier of the interlocutor to be updated.
   * @param {InterlocutorRequestDto} interlocutor - The data used to update the interlocutor.
   * @return {Observable<InterlocutorResDto>} An observable containing the updated interlocutor details.
   */
  updateInterlocutor(id: number, interlocutor: InterlocutorRequestDto): Observable<InterlocutorResDto> {
    return this.http.put<InterlocutorResDto>(`${this.baseUrl}/api/interlocutors/${id}`, interlocutor).pipe(
      tap((updatedInterlocutor: InterlocutorResDto) => {
        console.log("Updated Interlocutor: ", updatedInterlocutor);
      })
    );
  }

  /**
   * Deletes an interlocutor identified by the given ID using a soft delete operation.
   *
   * @param {number} interlocutorId - The unique identifier of the interlocutor to be deleted.
   * @return {Observable<void>} An observable that completes when the delete operation is successful.
   */
  deleteInterlocutorById(interlocutorId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/interlocutors/soft-delete/${interlocutorId}`);
  }

  /**
   * Retrieves a list of interlocutors based on the provided company ID.
   *
   * @param {number} companyId - The unique identifier of the company.
   * @return {Observable<InterlocutorResDto[]>} An observable containing an array of InterlocutorResDto objects.
   */
  getInterlocutorsByCompanyId(companyId: number): Observable<InterlocutorResDto[]>{
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<InterlocutorResDto[]>(`${this.baseUrl}/api/interlocutors/`, {params}).pipe(tap((interlocutors: InterlocutorResDto[]) => {
      interlocutors.map((interlocutor: InterlocutorResDto) => {
        new InterlocutorResDto(interlocutor)
      })
    }))
  }

  /**
   * Retrieves a list of interlocutors based on the provided filtering criteria.
   *
   * @param {InterlocutorsFilterRequestDto} filters - The filter criteria to be applied while retrieving interlocutors.
   * @return {Observable<InterlocutorResDto[]>} An observable emitting an array of interlocutor response DTOs.
   */
  getInterlocutorsByFilters(filters: InterlocutorsFilterRequestDto): Observable<InterlocutorResDto[]> {
    return this.http.post<InterlocutorResDto[]>(`${this.baseUrl}/api/interlocutors/filter-by-fields`, filters).pipe(
      tap((interlocutors: InterlocutorResDto[]) => {
      interlocutors.map((interlocutor: InterlocutorResDto) => {
        new InterlocutorResDto(interlocutor)
      })
    }))
  }

  /**
   * Performs a bulk soft delete operation for a list of interlocutor IDs.
   * This method sends a POST request to mark the specified interlocutors as soft deleted.
   *
   * @param {number[]} interlocutorsIds - An array of interlocutor IDs to be soft deleted.
   * @return {Observable<boolean>} An observable returning a boolean indicating the success of the operation.
   */
  bulkSoftDelete(interlocutorsIds: number[]): Observable<boolean>{
    return this.http.post<boolean>(`${this.baseUrl}/api/interlocutors/soft-delete/bulk`, interlocutorsIds)
  }

  exportExcelFile(companyId: number, selectedCustomerIds: number[] = []) {
    const params = { companyId: companyId.toString() };
    return this.http.post(`${this.baseUrl}/api/interlocutors/export`, selectedCustomerIds, {
      responseType: 'blob',
      params: params
    });
  }

}
