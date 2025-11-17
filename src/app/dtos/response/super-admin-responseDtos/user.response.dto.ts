import {RoleResponseDto} from "./role.response.dto";
import {RightsResponseDto} from "./rights.response.dto";
import {CompanyResponseDto} from "../../../../dtos/response/CompanyResponseDto";
import {UserDto} from "../../../../dtos/response/usersResponseDto";

export class UserResponseDto {
    id: number;
    logo: string;
    matriculate: string;
    name: string;
    email: string;
    aboutMe: string;
    phone: string;
    role!: RoleResponseDto | null;
    rights!: RightsResponseDto[];
    companies!: CompanyResponseDto[];
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: UserDto;
    updatedBy?: UserDto;

    constructor(data: any) {
        this.id = data.id;
        this.logo = data.logo || '';
        this.matriculate = data.matriculate || '';
        this.name = data.name || '';
        this.email = data.email || '';
        this.aboutMe = data.aboutMe || '';
        this.phone = data.phone || '';
        this.role = data.role ? new RoleResponseDto(data.role) : null;
        this.rights = data?.rights ? data.rights.map((right: any) => new RightsResponseDto(right)) : [];
        this.companies = data?.companies ? data.companies.map((company: any) => new CompanyResponseDto(company)) : [];
        this.createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
        this.createdBy = data.createdBy ? new UserDto(data.createdBy) : undefined;
        this.updatedBy = data.updatedBy ? new UserDto(data.updatedBy) : undefined;
    }
}
