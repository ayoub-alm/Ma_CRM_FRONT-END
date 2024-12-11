import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";
import {UserLoginRequest} from "../dtos/request/UserLoginRequest";
import {TokenResponse} from "../app/login/login.component";
import {environment} from '../environments/environment';
import {LocalStorageService} from './local.storage.service';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    this.baseUrl = environment.baseUrl;
  }

  login(userDetails: UserLoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.baseUrl+ '/auth/login', {email:userDetails.email, password:userDetails.password})
  }

  get currentUserRole(): string{
    let role = this.localStorageService.getItem('user').role
    return role;
  }


  get CurrentUserMatriculate(): string{
    return this.localStorageService.getItem('user').matriculate.toString()
  }

  getCurrentUserId(): number{
    return this.localStorageService.getItem('user').id
  }
}
