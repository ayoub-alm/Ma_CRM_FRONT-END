import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {CityResponseDto} from "../../dtos/init_data/response/city.response.dt";
import {CountryResponseDto} from "../../dtos/init_data/response/country.response.dto";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CountryService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAllCountries(): Observable<CountryResponseDto[]>{
    return this.http.get<CountryResponseDto[]>(this.baseUrl + '/api/countries').pipe(
      tap(countries => {
        countries.map(country => {new CountryResponseDto(country)});
      })
    );
  }
}
