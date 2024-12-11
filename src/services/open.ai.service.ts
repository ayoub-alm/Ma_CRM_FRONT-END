// openai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = process.env['OPENAI_API_KEY'];

  constructor(private http: HttpClient) {}

  getCompletion(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: 'gpt-3.5-turbo',  // Change model if needed (like 'gpt-3.5-turbo')
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Write a haiku about recursion in programming.' },
      ],
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
