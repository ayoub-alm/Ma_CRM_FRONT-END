import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';


export interface TrackingLog {
  id?: number;
  actionType: string; // e.g., CREATE, UPDATE, DELETE, VIEW
  timestamp: string; // ISO string
  entityType?: string; // Fully qualified class name
  entityId?: number; // ID of the entity
  user?: { id: number; name?: string }; // Reference to the user
  details?: string; // Additional details about the action
  changes?: string; // JSON string of changes
  endpoint?: string; // HTTP endpoint
  ipAddress?: string; // IP address
  httpMethod?: string; // HTTP method
  prospect?: { id: number }; // Reference to the prospect
  interaction?: { id: number }; // Reference to the interaction
  interlocutor?: { id: number }; // Reference to the interlocutor
  deletedAt?: string; // ISO string for soft-deleted logs
}

@Injectable({
  providedIn: 'root',
})
export class TrackingLogService {
  // @ts-ignore
  private readonly baseUrl = environment.baseUrl;
  private readonly apiUrl = this.baseUrl +'/api/tracking-logs'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  /**
   * Fetch all tracking logs that are not soft-deleted.
   * @returns An observable of the list of tracking logs.
   */
  getAllLogs(): Observable<TrackingLog[]> {
    return this.http.get<TrackingLog[]>(this.apiUrl);
  }

  /**
   * Fetch a specific tracking log by ID.
   * @param id The ID of the tracking log to retrieve.
   * @returns An observable of the tracking log.
   */
  getLogById(id: number): Observable<TrackingLog> {
    return this.http.get<TrackingLog>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create or update a tracking log.
   * @param log The tracking log to create or update.
   * @returns An observable of the saved tracking log.
   */
  saveLog(log: TrackingLog): Observable<TrackingLog> {
    return this.http.post<TrackingLog>(this.apiUrl, log);
  }

  /**
   * Soft delete a tracking log by ID.
   * @param id The ID of the tracking log to soft delete.
   * @returns An observable of the void response.
   */
  deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Restore a soft-deleted tracking log by ID.
   * @param id The ID of the tracking log to restore.
   * @returns An observable of the restored tracking log.
   */
  restoreLog(id: number): Observable<TrackingLog> {
    return this.http.patch<TrackingLog>(`${this.apiUrl}/restore/${id}`, {});
  }

  /**
   * Fetch tracking logs for a specific entity by entity type and entity ID.
   * @param entityType The fully qualified class name of the entity (e.g., "com.sales_scout.entity.UserEntity")
   * @param entityId The ID of the entity
   * @returns An observable of the list of tracking logs for the entity.
   */
  getLogsForEntity(entityType: string, entityId: number): Observable<TrackingLog[]> {
    return this.http.get<TrackingLog[]>(`${this.apiUrl}/entity/${encodeURIComponent(entityType)}/${entityId}`);
  }
}
