import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {RightsModel} from "../../models/super-admin/rights.model";
import {RightsResponseDto} from "../../dtos/response/super-admin-responseDtos/rights.response.dto";
import {RightsMapper} from "../../mappers/super-admin_mappers/rights.mapper";
import {RightsRequestDto} from "../../dtos/request/super-admin-requestDtos/rights.request.dto";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class RightsService {
    private readonly baseUrl: string = environment.baseUrl + '/api/rights';
    constructor(private http: HttpClient) {}

    /**
     *
     */
    getAllRights(): Observable<RightsModel[]> {
        return this.http.get<RightsResponseDto[]>(`${this.baseUrl}`).pipe(
            map(response => response.map(dto => RightsMapper.fromDto(dto)))
        )
    }

    /**
     *
     * @param rightId
     */
    getRightById(rightId: number): Observable<RightsModel> {
        return this.http.get<RightsResponseDto>(`${this.baseUrl}/${rightId}`).pipe(
            map(RightsResponseDto => RightsMapper.fromDto(RightsResponseDto))
        )
    }

    /**
     * Use Mapper toDto to convert Model to requestDto
     * @param newRight
     */
    createRight(newRight: RightsModel): Observable<RightsResponseDto> {
        const right = RightsMapper.toDto(newRight);
        return this.http.post<RightsResponseDto>(`${this.baseUrl}`, right)
    }

    /**
     * Use Mapper toDto to convert Model to requestDto
     * @param rightId
     * @param newRight
     */
    updateRight(rightId: number, newRight: RightsModel): Observable<RightsResponseDto> {
        const right = RightsMapper.toDto(newRight);
        return this.http.put<RightsResponseDto>(`${this.baseUrl}/${rightId}`, right)
    }

    /**
     *
     * @param rightId
     */
    softDeleteRight(rightId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/soft-delete/${rightId}`);
    }
}