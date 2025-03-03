import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

// Interfaces for Statistics Data
export interface DashboardCountDto {
  name: string;
  count: number;
}

export interface DashboardCountDto {
  interactionSubject?: string;
  interactionType?: string;
  sellerName?: string;
  count: number;
}

export interface DashboardCountDto {
  status?: string;
  jobTitle?: string;
  department?: string;
  count: number;
}

// Interfaces for API Filters
export interface CustomerFilterFields {
  statusIds?: number[];
  industryIds?: number[];
  cityIds?: number[];
  countryIds?: number[];
  companySizeIds?: number[];
  legalStatusIds?: number[];
  createdAtStart?: string;
  createdAtEnd?: string;
  sellerIds?: number[];
}

export interface InteractionFilterRequest {
  interactionSubjects?: string[];
  interactionTypes?: string[];
  sellerIds?: number[];
  createdAtStart?: string;
  createdAtEnd?: string;
}

export interface InterlocutorFilterRequest {
  status?: string[];
  jobTitlesIds?: number[];
  departmentIds?: number[];
  createdAtStart?: string;
  createdAtEnd?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = environment.baseUrl + '/api/statistics'; // Base API URL

  constructor(private http: HttpClient) {}

  /** CUSTOMER STATISTICS **/

  getCustomerCountByStatus(filters: CustomerFilterFields): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/customers/count-by-status`, filters);
  }

  getCustomerCountByIndustry(filters: CustomerFilterFields): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/customers/count-by-industry`, filters);
  }

  getCustomerCountByCity(filters: CustomerFilterFields): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/customers/count-by-city`, filters);
  }

  getCustomerCountByCountry(filters: CustomerFilterFields): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/customers/count-by-country`, filters);
  }

  getCustomerCountByCompanySize(filters: CustomerFilterFields): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/customers/count-by-company-size`, filters);
  }

  getCustomerCountByLegalStatus(filters: CustomerFilterFields): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/customers/count-by-legal-status`, filters);
  }

  getCustomerCountByDate(filters: CustomerFilterFields): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/customers/count-by-date`, filters);
  }

  getCustomerCountBySeller(filters: CustomerFilterFields): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/customers/count-by-seller`, filters);
  }

  /** INTERACTION STATISTICS **/

  getInteractionCountByType(filters: InteractionFilterRequest): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/interactions/count-by-type`, filters);
  }

  getInteractionCountBySubject(filters: InteractionFilterRequest): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/interactions/count-by-subject`, filters);
  }

  getInteractionCountBySeller(filters: InteractionFilterRequest): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/interactions/count-by-seller`, filters);
  }

  /** INTERLOCUTOR STATISTICS **/

  getInterlocutorCountByStatus(filters: InterlocutorFilterRequest): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/interlocutors/count-by-status`, filters);
  }

  getInterlocutorCountByJobTitle(filters: InterlocutorFilterRequest): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/interlocutors/count-by-job-title`, filters);
  }

  getInterlocutorCountByDepartment(filters: InterlocutorFilterRequest): Observable<DashboardCountDto[]> {
    return this.http.post<DashboardCountDto[]>(`${this.apiUrl}/interlocutors/count-by-department`, filters);
  }
}
