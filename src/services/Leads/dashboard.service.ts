import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {ProspectCountDto} from '../../enums/leads/prospect.count.dto';
import {LeadsDashboardCounts} from '../../dtos/response/leads.dashboard.counts';
import {DashboardCounts} from './dashboard.dtos';
import {CustomerFilterFields} from './statustucs.service';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  private readonly baseUrl = environment.baseUrl +'/api/leads/dashboard'; // Adjust base URL as needed

  constructor(private http: HttpClient) {}

    // getProspectCountPerStatus(): Observable<ProspectCountDto[]> {
    //     return this.http.get<ProspectCountDto[]>(`${this.baseUrl}/customer-per-status`).pipe(tap(counts => {
    //     counts.map(count => new ProspectCountDto(count)) // Transform data if needed
    //         .sort((a, b) => a.count - b.count) // Sort by count
    //     }))
    // }

    getCounts(): Observable<LeadsDashboardCounts>{
        return this.http.get<LeadsDashboardCounts>(`${this.baseUrl}/counts`).pipe(tap(counts => {
          new LeadsDashboardCounts(counts);
      }))
    }

  // Get count of customers per status
  getProspectCountPerStatus(customerFilters: CustomerFilterFields = {} as CustomerFilterFields): Observable<DashboardCounts[]> {
    return this.http.post<DashboardCounts[]>(`${this.baseUrl}/customer-per-status`, customerFilters).pipe(tap(counts => {
     return  counts.map(count => new DashboardCounts(count.label,count.count)) // Transform data if needed
        .sort((a, b) => a.count - b.count) // Sort by count
    }))
  }

  // Get count of customers per interest
  getCountOfCustomerPerInterest(): Observable<CustomerCountDto[]> {
    return this.http.get<CustomerCountDto[]>(`${this.baseUrl}/customer-per-interest`);
  }

  // Get count of customers per seller
  getCountOfCustomerPerSeller(customerFilters: CustomerFilterFields = {} as CustomerFilterFields): Observable<DashboardCounts[]> {
    return this.http.post<DashboardCounts[]>(`${this.baseUrl}/customer-per-seller`, customerFilters).pipe(tap(counts => {
      counts.map(count => new DashboardCounts(count.label,count.count)) // Transform data if needed
        .sort((a, b) => a.count - b.count) // Sort by count
    }))
  }

  // Get count of customers per city
  getCountOfCustomerPerCity(customerFilters: CustomerFilterFields = {} as CustomerFilterFields): Observable<DashboardCounts[]> {
    return this.http.post<DashboardCounts[]>(`${this.baseUrl}/customer-per-city` ,customerFilters).pipe(tap(counts => {
      counts.map(count => new DashboardCounts(count.label,count.count)) // Transform data if needed
        .sort((a, b) => a.count - b.count) // Sort by count
    }))
  }

  // Get count of customers per date
  getCountOfCustomerPerDate(customerFilters: CustomerFilterFields = {} as CustomerFilterFields): Observable<DashboardCounts[]> {
    return this.http.post<DashboardCounts[]>(`${this.baseUrl}/customer-per-date`, customerFilters).pipe(tap(counts => {
      counts.map(count => new DashboardCounts(count.label,count.count)) // Transform data if needed
        .sort((a, b) => a.count - b.count) // Sort by count
    }))
  }
  // Get count of customers per industry
  getCountOfCustomerPerIndustry(customerFilters: CustomerFilterFields = {} as CustomerFilterFields): Observable<DashboardCounts[]> {
    return this.http.post<DashboardCounts[]>(`${this.baseUrl}/customer-per-industry`, customerFilters).pipe(tap(counts => {
      counts.map(count => new DashboardCounts(count.label,count.count)) // Transform data if needed
        .sort((a, b) => a.count - b.count) // Sort by count
    }))
  }

  getCountOfCustomerPerStructure(customerFilters: CustomerFilterFields = {} as CustomerFilterFields): Observable<DashboardCounts[]> {
    return this.http.post<DashboardCounts[]>(`${this.baseUrl}/customer-per-structure`, customerFilters).pipe(tap(counts => {
      counts.map(count => new DashboardCounts(count.label,count.count)) // Transform data if needed
        .sort((a, b) => a.count - b.count) // Sort by count
    }))
  }


  // Get count of interactions per seller
  getCountOfInteractionPerSeller(): Observable<InteractionCountDto[]> {
    return this.http.get<InteractionCountDto[]>(`${this.baseUrl}/interaction-per-seller`);
  }

  // Get count of interactions per subject
  getCountOfInteractionPerSubject(): Observable<InteractionCountDto[]> {
    return this.http.get<InteractionCountDto[]>(`${this.baseUrl}/interaction-per-subject`);
  }

  // Get count of interactions per type
  getCountOfInteractionPerType(): Observable<InteractionCountDto[]> {
    return this.http.get<InteractionCountDto[]>(`${this.baseUrl}/interaction-per-type`);
  }

  // Get count of interlocutors per seller
  getCountOfInterlocutorBySeller(): Observable<InterlocutorCountDto[]> {
    return this.http.get<InterlocutorCountDto[]>(`${this.baseUrl}/interlocutor-per-seller`);
  }
}
export interface CountsDto {
  countOfProspects: number;
  CountOfInteractions: number;
  CountOfInterlocutors: number;
}

export interface CustomerCountDto {
  status: string;
  interest: any;
  seller: string;
  city: any;
  date: string;
  industry: any;
  count: number;
}

export interface InteractionCountDto {
  subject?: string;
  type?: string;
  seller?: string;
  count: number;
}

export interface InterlocutorCountDto {
  seller: string;
  company?: any;
  count: number;
}
