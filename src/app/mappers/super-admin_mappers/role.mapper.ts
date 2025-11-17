import {RoleResponseDto} from "../../dtos/response/super-admin-responseDtos/role.response.dto";
import {RoleModel} from "../../models/super-admin/role.model";
import {RoleRequestDto} from "../../dtos/request/super-admin-requestDtos/role.request.dto";

export class RoleMapper {

    // Map from RoleResponseDto to RoleModel
    static fromDto(dto: RoleResponseDto): RoleModel {
        return new RoleModel({
            id: dto.id,
            role: dto.role,
            description: dto.description,
            companyId: dto.companyId
        });
    }

    // Map from RoleModel to RoleRequestDto
    static toDto(model: RoleModel): RoleRequestDto {
        return new RoleRequestDto(
            model.role,
            model.description,
            model.companyId
        );
    }
}