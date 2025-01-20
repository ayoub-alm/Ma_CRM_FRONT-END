import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, tap} from 'rxjs';
import {InterlocutorRequestDto} from '../../dtos/request/interlocutorRequestDto';
import {InterlocutorResDto} from '../../dtos/response/interlocutor.dto';

@Injectable({
  providedIn: 'root'
})

export class InterlocutorService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAllInterlocutors(): Observable<InterlocutorResDto[]>{
    return this.http.get<InterlocutorResDto[]>(`${this.baseUrl}/api/interlocutors`).pipe(tap((interlocutors: InterlocutorResDto[]) => {
      interlocutors.map((interlocutor: InterlocutorResDto) => {
        new InterlocutorResDto(interlocutor)
      })
    }))
  }

  getInterlocutorsByProspectId(prospectId: number): Observable<InterlocutorResDto[]>{
    return this.http.get<InterlocutorResDto[]>(`${this.baseUrl}/api/interlocutors/prospect/${prospectId}`).pipe(tap((interlocutors: InterlocutorResDto[]) => {
      interlocutors.map((interlocutor: InterlocutorResDto) => {
        new InterlocutorResDto(interlocutor)
      })
    }))
  }


  getInterlocutorById(id: number): Observable<InterlocutorResDto>{
    return this.http.get<InterlocutorResDto>(`${this.baseUrl}/api/interlocutors/${id}`).pipe(
      tap((interlocutor: InterlocutorResDto) => {
        new InterlocutorResDto(interlocutor)
    }))
  }

  createInterlocutor(interlocutor: InterlocutorRequestDto): Observable<InterlocutorResDto> {
    return this.http.post<InterlocutorResDto>(`${this.baseUrl}/api/interlocutors`, interlocutor).pipe(
      tap((interlocutor: InterlocutorResDto) => {
      new InterlocutorResDto(interlocutor)
    }))
  }

  updateInterlocutor(id: number, interlocutor: InterlocutorRequestDto): Observable<InterlocutorResDto> {
    return this.http.put<InterlocutorResDto>(`${this.baseUrl}/api/interlocutors/${id}`, interlocutor).pipe(
      tap((updatedInterlocutor: InterlocutorResDto) => {
        console.log("Updated Interlocutor: ", updatedInterlocutor);
      })
    );
  }

  exportInterlocutor(selectedInterlocutors?: any[]): Observable<Blob> {
    let params = new HttpParams();
    if (selectedInterlocutors && selectedInterlocutors.length > 0) {
      // Convert the selected prospects to a JSON string
      const interlocutorsJson = JSON.stringify(selectedInterlocutors);
      params = params.set('interlocutorsJson', interlocutorsJson);
    }

    return this.http.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob', // Expect a binary response (Excel file)
    });
  }
}
