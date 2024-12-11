import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {CityResponseDto} from "../../dtos/init_data/response/city.response.dt";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CityService{
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAllCities(): Observable<CityResponseDto[]>{
    return this.http.get<CityResponseDto[]>(this.baseUrl + '/api/cities').pipe(
      tap(cities => {
        cities.map(cities => {new CityResponseDto(cities)});
      })
    );
  }
}
