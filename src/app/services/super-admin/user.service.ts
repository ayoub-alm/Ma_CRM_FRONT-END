import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {UserModel} from "../../models/super-admin/user.model";
import {UserResponseDto} from "../../dtos/response/super-admin-responseDtos/user.response.dto";
import {UserMapper} from "../../mappers/super-admin_mappers/user.mapper";
import {UserRequestDto} from "../../dtos/request/super-admin-requestDtos/user.request.dto";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private readonly baseUrl: string = environment.baseUrl ='/api/users';
    constructor(private http: HttpClient) {}

    /**
     * Use Mapper fromDto to convert responseDto to Model
     */
    getAllUsers(): Observable<UserResponseDto[]> {
        return this.http.get<UserResponseDto[]>(`${this.baseUrl}`)
    }

    /**
     * Use Mapper fromDto to convert responseDto to Model
     * @param userId
     */
    getUserById(userId: number): Observable<UserResponseDto> {
        return this.http.get<UserResponseDto>(`${this.baseUrl}/${userId}`);
    }

    /**
     * Use Mapper toDto to convert Model to requestDto
     * @param newUser
     */
    createUser(newUser: UserModel): Observable<UserRequestDto> {
        const user = UserMapper.toDto(newUser);
        return this.http.post<UserRequestDto>(`${this.baseUrl}`, user)
    }

    /**
     * Use Mapper toDto to convert Model to requestDto
     * @param userId
     * @param newUser
     */
    updateUser(userId: number, newUser: UserModel): Observable<UserRequestDto> {
        const user = UserMapper.toDto(newUser);
        return this.http.put<UserRequestDto>(`${this.baseUrl}/${userId}`, user)
    }

    /**
     *
     * @param userId
     */
    softDeleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/soft-delete=${userId}`);
    }
}
