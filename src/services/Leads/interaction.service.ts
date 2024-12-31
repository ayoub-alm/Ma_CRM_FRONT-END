import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {InteractionResponseDto} from '../../dtos/response/interaction.response.dto';
import {InteractionRequestDto} from '../../dtos/request/interaction.request.dto';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private readonly baseUrl = environment.baseUrl +'/api/interaction'; // Adjust base URL as needed

  constructor(private http: HttpClient) {}

  /**
   * Get all interactions.
   * @returns Observable list of InteractionResponseDto.
   */
  getAllInteractions(): Observable<InteractionResponseDto[]> {
    return this.http.get<InteractionResponseDto[]>(`${this.baseUrl}`);
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
    return this.http.post<InteractionResponseDto>(`${this.baseUrl}/create`, interaction);
  }

  /**
   * Soft delete an interaction.
   * @param id Interaction ID.
   * @returns Observable of void.
   */
  softDeleteInteraction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Restore a soft-deleted interaction.
   * @param id Interaction ID.
   * @returns Observable of InteractionResponseDto.
   */
  restoreInteraction(id: number): Observable<InteractionResponseDto> {
    return this.http.patch<InteractionResponseDto>(`${this.baseUrl}/restore/${id}`, {});
  }
}
