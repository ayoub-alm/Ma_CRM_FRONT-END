import {RoleResponseDto} from "../../dtos/response/super-admin-responseDtos/role.response.dto";
import {RoleModel} from "../../models/super-admin/role.model";
import {RightsMapper} from "./rights.mapper";
import {RoleRequestDto} from "../../dtos/request/super-admin-requestDtos/role.request.dto";

export class RoleMapper {

    // Map from RoleResponseDto to RoleModel
    static fromDto(dto: RoleResponseDto): RoleModel {
        return new RoleModel({
            id: dto.id,
            name: dto.name,
            rights: dto.rights.map(RightsMapper.fromDto), // Mapping rights array
        });
    }

    // Map from RoleModel to RoleRequestDto
    static toDto(model: RoleModel): RoleRequestDto {
        return new RoleRequestDto(
            model.name,
            model.companyId,
            model.rights.map(RightsMapper.toDto), // Mapping rights array
        )
    }
}