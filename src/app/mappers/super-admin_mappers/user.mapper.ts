import {UserResponseDto} from "../../dtos/response/super-admin-responseDtos/user.response.dto";
import {UserRequestDto} from "../../dtos/request/super-admin-requestDtos/user.request.dto";
import {UserModel} from "../../models/super-admin/user.model";
import {CompanyMapper} from "./company.mappers";

export class UserMapper {

    // Map from UserResponseDto to UserModel
    static fromDto(dto: UserResponseDto): UserModel {
        return new UserModel({
            id: dto.id,
            logo: dto.logo,
            matriculate: dto.matriculate,
            name: dto.name,
            email: dto.email,
            password: '', // Password is not returned in response for security
            aboutMe: dto.aboutMe,
            phone: dto.phone,
            role: dto.role,
            rights: dto.rights,
            companies: dto.companies ? dto.companies.map(company => CompanyMapper.fromDto(company)) : []
        });
    }

    // Map from UserModel to UserRequestDto
    static toDto(model: UserModel): UserRequestDto {
        return new UserRequestDto(
            model.logo || '',
            model.matriculate || '',
            model.name || '',
            model.email || '',
            model.password || '',
            model.aboutMe || '',
            model.phone || '',
            model.role ? model.role.id : null, // Send role ID instead of full role object
            model.rights ? model.rights.map(right => right.id) : [], // Send right IDs instead of full right objects
            model.companies ? model.companies.map(company => company.id) : [] // Mapping company IDs
        );
    }
}
