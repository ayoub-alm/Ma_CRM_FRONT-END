import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, tap} from 'rxjs';
import {PaymentMethodResponseDto} from '../../dtos/init_data/response/paymentMethodResponseDto';

@Injectable({
  providedIn: 'root'
})


export class PaymentMethodService {
  baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}


  getAllPaymentMethods():Observable<PaymentMethodResponseDto[]>{
    return this.http.get<PaymentMethodResponseDto[]>(`${this.baseUrl}/api/payment-methods`).pipe(tap((response: PaymentMethodResponseDto[]) => {
      new PaymentMethodResponseDto(response);
    }))
  }
}
