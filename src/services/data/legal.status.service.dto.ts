import {Injectable} from "@angular/core";
import {Logger} from "@angular/compiler-cli";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {LegalStatusDto} from "../../dtos/init_data/response/legal.status.dto";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LegalStatusService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAllLegalStatus(): Observable<LegalStatusDto[]> {
    return this.http.get<LegalStatusDto[]>(`${this.baseUrl}/api/legal-statuses`).pipe(
      tap(legalStatusDtos => {
        legalStatusDtos.map(legalStatusDto => {new LegalStatusDto(legalStatusDto)});
      })
    );
  }
}
