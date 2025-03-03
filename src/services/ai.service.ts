import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'http://127.0.0.1:5000/generate'; // Your Flask API endpoint

  constructor(private http: HttpClient) {}

  generateText(prompt: string): Observable<{ response: string }> {
    const requestBody = { prompt: prompt };
    return this.http.post<{ response: string }>(this.apiUrl, requestBody);
  }
}
