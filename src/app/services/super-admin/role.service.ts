import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {RoleModel} from "../../models/super-admin/role.model";
import {RoleResponseDto} from "../../dtos/response/super-admin-responseDtos/role.response.dto";
import {RoleMapper} from "../../mappers/super-admin_mappers/role.mapper";
import {RoleRequestDto} from "../../dtos/request/super-admin-requestDtos/role.request.dto";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private readonly baseUrl: string = environment.baseUrl = '/api/roles';
    constructor(private http: HttpClient) {}

    /**
     *
     */
    getAllRoles(): Observable<RoleModel[]> {
        return this.http.get<RoleResponseDto[]>(`${environment.baseUrl}`).pipe(
            map(response => response.map(dto => RoleMapper.fromDto(dto)))
        )
    }

    /**
     *
     * @param roleId
     */
    getRoleById(roleId: number): Observable<RoleModel> {
        return this.http.get<RoleResponseDto>(`${environment.baseUrl}/${roleId}`).pipe(
            map(RoleResponseDto => RoleMapper.fromDto(RoleResponseDto))
        )
    }

    /**
     * Use Mapper toDto to convert Model to requestDto
     * @param newRole
     */
    createRole(newRole: RoleModel): Observable<RoleRequestDto> {
        const role = RoleMapper.toDto(newRole);
        return this.http.post<RoleModel>(`${environment.baseUrl}`, role);
    }

    /**
     * Use Mapper toDto to convert Model to requestDto
     * @param roleId
     * @param newRole
     */
    updateRole(roleId: number, newRole: RoleModel): Observable<RoleRequestDto> {
        const role = RoleMapper.toDto(newRole);
        return this.http.put<RoleModel>(`${environment.baseUrl}/${roleId}`, role);
    }

    /**
     *
     * @param roleId
     */
    softDeleteRole(roleId: number): Observable<void> {
        return this.http.delete<void>(`${environment.baseUrl}/soft-delete=${roleId}`);
    }
}