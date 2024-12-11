import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IndustryResponseDto} from "../../dtos/init_data/response/industry.response.dt";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class IndustryService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAllIndustries(): Observable<IndustryResponseDto[]> {
    return this.http.get<IndustryResponseDto[]>(`${this.baseUrl}/api/industries`);
  }
}
