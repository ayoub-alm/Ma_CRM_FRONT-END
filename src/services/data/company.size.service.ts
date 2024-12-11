import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CompanySizeResponseDto} from "../../dtos/init_data/response/company.size.response.dt";
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})

export class CompanySizeService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllCompaniesSizes(): Observable<CompanySizeResponseDto[]>{
      return this.http.get<CompanySizeResponseDto[]>(`${this.baseUrl}/api/company-size`);
  }
}
