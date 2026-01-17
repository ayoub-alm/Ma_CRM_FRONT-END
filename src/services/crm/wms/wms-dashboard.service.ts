import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WmsDashboardCounts } from '../../../dtos/response/crm/wms.dashboard.counts';
import { DashboardCounts } from '../../Leads/dashboard.dtos';
import { LocalStorageService } from '../../local.storage.service';

@Injectable({
    providedIn: 'root'
})
export class WmsDashboardService {
    private readonly baseUrl = environment.baseUrl + '/api/crm/wms/dashboard';

    constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

    getCounts(): Observable<WmsDashboardCounts> {
        const companyId = this.localStorageService.getCurrentCompanyId();
        return this.http.get<WmsDashboardCounts>(`${this.baseUrl}/counts?companyId=${companyId}`).pipe(
            map(counts => new WmsDashboardCounts(counts))
        );
    }

    // Example chart data: Offers per Status
    getOffersPerStatus(): Observable<DashboardCounts[]> {
        const companyId = this.localStorageService.getCurrentCompanyId();
        return this.http.get<DashboardCounts[]>(`${this.baseUrl}/offers-per-status?companyId=${companyId}`).pipe(
            map(counts => counts.map(count => new DashboardCounts(count.label, count.count)))
        );
    }
}
