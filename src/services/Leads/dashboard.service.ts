import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {ProspectCountDto} from '../../enums/leads/prospect.count.dto';
import {LeadsDashboardCounts} from '../../dtos/response/leads.dashboard.counts';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  private readonly baseUrl = environment.baseUrl +'/api/leads/dashboard'; // Adjust base URL as needed

  constructor(private http: HttpClient) {}

    getProspectCountPerStatus(): Observable<ProspectCountDto[]> {
        return this.http.get<ProspectCountDto[]>(`${this.baseUrl}/prospect-per-status`).pipe(tap(counts => {
        counts.map(count => new ProspectCountDto(count)) // Transform data if needed
            .sort((a, b) => a.count - b.count) // Sort by count
        }))
    }

    getCounts(): Observable<LeadsDashboardCounts>{
        return this.http.get<LeadsDashboardCounts>(`${this.baseUrl}/counts`).pipe(tap(counts => {
          new LeadsDashboardCounts(counts);
      }))
    }
}
