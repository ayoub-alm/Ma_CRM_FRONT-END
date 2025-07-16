import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import {StockedItemResponseDto} from '../../../dtos/response/crm/stocked.itemresponse.dto';
import {StockedItemProvision} from '../../../models/stocked.item.provision.dto';

@Injectable({
  providedIn: 'root',
})

export class StockedItemService{
  private readonly baseUrl: string = environment.baseUrl+'/api/stocked-items';
  constructor(private http: HttpClient) {}


  deleteStockedItemFromNeed(id: number): Observable<boolean>{
    return this.http.delete<boolean>(`${this.baseUrl}`+id)
  }



}
