import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserDto} from '../dtos/response/usersResponseDto';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}


  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.baseUrl+"/api/users").pipe(tap(
      users => {
        users.map(user => {
          new UserDto(user);
        })
      }
    ))
  }
}
