import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CustomerStatus} from '../../dtos/response/cutomer.status.dto';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CustomerStatusService {
  private apiUrl = environment.baseUrl + "/api/customer-status";

  constructor(private http: HttpClient) {}

  /**
   * Get all active customer statuses (excluding soft-deleted ones).
   */
  getAllActiveStatuses(): Observable<CustomerStatus[]> {
    return this.http.get<CustomerStatus[]>(this.apiUrl);
  }

  /**
   * Get a specific customer status by ID.
   */
  getStatusById(id: number): Observable<CustomerStatus> {
    return this.http.get<CustomerStatus>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create or update a customer status.
   */
  saveOrUpdateStatus(status: CustomerStatus): Observable<CustomerStatus> {
    return this.http.post<CustomerStatus>(this.apiUrl, status);
  }

  /**
   * Soft delete a customer status (marks it as deleted instead of removing).
   */
  softDeleteStatus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
