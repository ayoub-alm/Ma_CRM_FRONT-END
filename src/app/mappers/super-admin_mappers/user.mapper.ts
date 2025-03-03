import {UserResponseDto} from "../../dtos/response/super-admin-responseDtos/user.response.dto";
import {RoleMapper} from "./role.mapper";
import {RightsMapper} from "./rights.mapper";
import {UserRequestDto} from "../../dtos/request/super-admin-requestDtos/user.request.dto";
import {UserModel} from "../../models/super-admin/user.model";

export class UserMapper {

    // Map from UserResponseDto to UserModel
    static fromDto(dto: UserResponseDto): UserModel {
        return new UserModel({
            id: dto.id,
            image: dto.image,
            matricule: dto.matricule,
            name: dto.name,
            lastName: dto.lastName,
            departementId: dto.departementId,
            email: dto.email,
            password: dto.password,
            aboutMe: dto.aboutMe,
            phone: dto.phone,
            role: dto.role ,
            rights:dto.rights
        });
    }

    // Map from UserModel to UserRequestDto
    static toDto(model: UserModel): UserRequestDto {
        return new UserRequestDto(
            model.image,
            model.matricule,
            model.name,
            model.lastName,
            model.departementId,
            model.email,
            model.password,
            model.aboutMe,
            model.phone,
            model.companyId,
            RoleMapper.toDto(model.role), // Mapping role
            model.rights.map(RightsMapper.toDto), // Mapping rights array
        );
    }
}
