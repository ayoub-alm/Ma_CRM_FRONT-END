import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface StackedLevelResponseDto {
    id: number;
    name: string;
    description?: string;
}

@Injectable({
    providedIn: 'root'
})
export class StackedLevelService {
    private apiUrl = `${environment.apiUrl}/api/stacked-levels`;

    constructor(private http: HttpClient) { }

    getAllStackedLevelsByCompanyId(companyId: number): Observable<StackedLevelResponseDto[]> {
        return this.http.get<StackedLevelResponseDto[]>(`${this.apiUrl}/company/${companyId}`);
    }

    getAllStackedLevels(): Observable<StackedLevelResponseDto[]> {
        return this.http.get<StackedLevelResponseDto[]>(this.apiUrl);
    }

    getStackedLevelById(id: number): Observable<StackedLevelResponseDto> {
        return this.http.get<StackedLevelResponseDto>(`${this.apiUrl}/${id}`);
    }
}
