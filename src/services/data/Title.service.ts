import {Injectable} from "@angular/core";

import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {DepartmentModel} from "../../models/department.model";
import {TitleResponseDto} from "../../dtos/init_data/response/title.response.dto";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TitleService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  /**
   * This function allows us to get title of person
   */
  getAllTitles(): Observable<TitleResponseDto[]>{
    return this.http.get<TitleResponseDto[]>(this.baseUrl + '/api/titles').pipe(
      tap(titles => {
        titles.map(title => { new TitleResponseDto(title); })
      })
    );
  }
}
