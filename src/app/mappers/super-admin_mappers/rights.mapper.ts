import {RightsResponseDto} from "../../dtos/response/super-admin-responseDtos/rights.response.dto";
import {RightsModel} from "../../models/super-admin/rights.model";
import {RightsRequestDto} from "../../dtos/request/super-admin-requestDtos/rights.request.dto";

export class RightsMapper {
    // Map from ResponseDto (API Response) to Model (Internal data structure)
    static fromDto(dto: RightsResponseDto): RightsModel {
        return new RightsModel({
            id: dto.id,
            description: dto.description,
            name: dto.name,
        });
    }

    static toDto(model: RightsModel): RightsRequestDto {
        return new RightsRequestDto(
            model.name,
            model.description,
            model.companyId,
        );
    }
}