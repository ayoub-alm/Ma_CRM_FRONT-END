import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {StockedItemProvision} from '../../../models/stocked.item.provision.dto';

@Injectable({
  providedIn: 'root',
})
export class StockedItemProvisionService {
  private apiUrl = 'http://localhost:8080/api/stocked-item-provisions'; // Adjust API URL if needed

  constructor(private http: HttpClient) {}

  // Get all stocked item provisions
  getAll(): Observable<StockedItemProvision[]> {
    return this.http.get<StockedItemProvision[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get a single stocked item provision by ID
  getById(id: number): Observable<StockedItemProvision> {
    return this.http.get<StockedItemProvision>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new stocked item provision
  create(provision: StockedItemProvision): Observable<StockedItemProvision> {
    return this.http.post<StockedItemProvision>(this.apiUrl, provision).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing stocked item provision
  update(id: number, provision: StockedItemProvision, stockedItemId: number): Observable<StockedItemProvision> {
    return this.http.put<StockedItemProvision>(`${this.apiUrl}/${id}/${stockedItemId}`, provision)
  }

  // Delete a stocked item provision by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle HTTP errors
  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }
}
