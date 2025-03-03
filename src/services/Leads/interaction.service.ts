import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {InteractionResponseDto} from '../../dtos/response/interaction.response.dto';
import {InteractionRequestDto} from '../../dtos/request/leads/interaction.request.dto';
import {environment} from '../../environments/environment';
import {InteractionFilterDto} from '../../dtos/filters/interaction.filter.request.dto';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private readonly baseUrl = environment.baseUrl +'/api/interactions'; // Adjust base URL as needed

  constructor(private http: HttpClient) {}

  /**
   * Get all interactions.
   * @returns Observable list of InteractionResponseDto.
   */
  getAllInteractions(companyId:number, searchValue: string = ""): Observable<InteractionResponseDto[]> {
    const params = new HttpParams().set('companyId', companyId).set('searchValue', searchValue);
    return this.http.get<InteractionResponseDto[]>(`${this.baseUrl}`, {params}).pipe(
      tap(data => {
        data.map(value => {
          new InteractionResponseDto(value)
        })
      })
    );
  }

  /**
   * Get all interactions by interlocutor ID.
   * @returns Observable list of InteractionResponseDto.
   */
  getAllInteractionsByInterlocutorId(interlocutorId: number): Observable<InteractionResponseDto[]> {
    return this.http.get<InteractionResponseDto[]>(`${this.baseUrl}/interlocutor/${interlocutorId}`).pipe(tap(data => {
      data.map(value => {
        new InteractionResponseDto(value)
      })
    }));
  }


  /**
   * Get interaction by ID.
   * @param id Interaction ID.
   * @returns Observable of InteractionResponseDto.
   */
  getInteractionById(id: number): Observable<InteractionResponseDto> {
    return this.http.get<InteractionResponseDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create or update an interaction.
   * @param interaction InteractionRequestDto.
   * @returns Observable of InteractionResponseDto.
   */
  createOrUpdateInteraction(interaction: InteractionRequestDto): Observable<InteractionResponseDto> {
    return this.http.post<InteractionResponseDto>(`${this.baseUrl}`, interaction);
  }

  /**
   * Soft delete an interaction.
   * @param id Interaction ID.
   * @returns Observable of void.
   */
  softDeleteInteraction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/soft-delete/${id}`);
  }

  BulkSoftDeleteInteraction(ids: number[]): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/soft-delete/bulk` , ids);
  }

  /**
   * Restore a soft-deleted interaction.
   * @param id Interaction ID.
   * @returns Observable of InteractionResponseDto.
   */
  restoreInteraction(id: number): Observable<InteractionResponseDto> {
    return this.http.patch<InteractionResponseDto>(`${this.baseUrl}/restore/${id}`, {});
  }

  /**
   * Exports an Excel file containing data for the given company and selected interactions.
   *
   * @param {number} companyId - The ID of the company whose data is to be exported.
   * @param {number[]} [selectedInteractionsIds=[]] - An optional array of interaction IDs to include in the export. Defaults to an empty array.
   * @return {Observable<Blob>} An observable containing the exported Excel file in Blob format.
   */
  exportExcelFile(companyId: number, selectedInteractionsIds: number[] = []) {
    const params = { companyId: companyId.toString() };
    return this.http.post(`${this.baseUrl}/export`, selectedInteractionsIds, {
      responseType: 'blob',
      params: params
    });
  }

  /**
   * Fetch interactions based on filter criteria.
   * @param filterData
   */
  filterInteractions(filterData: InteractionFilterDto): Observable<InteractionResponseDto[]> {
    return this.http.post<InteractionResponseDto[]>(`${this.baseUrl}/filter-by-fields`, filterData);
  }

}
