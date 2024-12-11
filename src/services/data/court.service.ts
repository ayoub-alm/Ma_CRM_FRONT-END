import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {CourtResponseDto} from "../../dtos/init_data/response/court.response.dto";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  getAllCourt(): Observable<CourtResponseDto[]> {
    return this.http.get<CourtResponseDto[]>(this.baseUrl + '/api/courts').pipe(
      tap(courts => {
        courts.map(court => {
          new CourtResponseDto(court)
        })
      })
    );
  }
}
