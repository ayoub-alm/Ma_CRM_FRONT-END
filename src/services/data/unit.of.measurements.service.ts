import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UniteOfMeasurementResponseDto} from '../../dtos/init_data/response/unite.of.measurement.dto';

@Injectable({
  providedIn: 'root'
})

export class UnitOfMeasurementsService{
  private readonly baseUrl: string = environment.baseUrl + '/api/unit-of-measurements';
  constructor(private http: HttpClient) {};

  getAllUnitOfMeasurement(): Observable<UniteOfMeasurementResponseDto[]>{
    return this.http.get<UniteOfMeasurementResponseDto[]>(`${this.baseUrl}`)
  }
}
