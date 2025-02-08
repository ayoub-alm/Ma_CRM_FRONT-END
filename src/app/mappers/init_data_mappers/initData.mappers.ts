// initData.mappers.ts

import { LegalStatusModel } from '../../models/init_data_models/legalStatus.model';
import { CityModel } from '../../models/init_data_models/city.model';
import { CourtModel } from '../../models/init_data_models/court.model';
import { IndustryModel } from '../../models/init_data_models/industry.model';
import { CountryModel } from '../../models/init_data_models/country.model';
import { ProprietaryStructureModel } from '../../models/init_data_models/proprietaryStructure.model';
import { TitleModel } from '../../models/init_data_models/title.model';
import { JobTitleModel } from '../../models/init_data_models/jobTitle.model';

import { LegalStatusDto } from '../../../dtos/init_data/response/legal.status.dto';
import { CityResponseDto } from '../../../dtos/init_data/response/city.response.dt';
import { CourtResponseDto } from '../../../dtos/init_data/response/court.response.dto';
import { IndustryResponseDto } from '../../../dtos/init_data/response/industry.response.dt';
import { CountryResponseDto } from '../../../dtos/init_data/response/country.response.dto';
import { ProprietaryStructureDto } from '../../../dtos/init_data/response/proprietary.structure.dto';
import { TitleResponseDto } from '../../../dtos/init_data/response/title.response.dto';
import { JobTitleResponseDto } from '../../../dtos/init_data/response/job.title.response.dto';

// DTO to Model (Works for both Request and Response DTOs)
export function mapLegalStatusDtoToModel(dto: LegalStatusDto): LegalStatusModel {
    return new LegalStatusModel({
        createdAt: new Date(dto.createdAt),
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
        createdBy: dto.createdBy,
        id: dto.id,
        name: dto.name,
        active: dto.active,
    });
}

export function mapCityDtoToModel(dto: CityResponseDto): CityModel {
    return new CityModel({
        createdAt: new Date(dto.createdAt),
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
        createdBy: dto.createdBy,
        id: dto.id,
        name: dto.name,
        active: dto.active,
    });
}

export function mapCourtDtoToModel(dto: CourtResponseDto): CourtModel {
    return new CourtModel({
        createdAt: new Date(dto.createdAt),
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
        createdBy: dto.createdBy,
        id: dto.id,
        name: dto.name,
        active: dto.active,
    });
}

export function mapIndustryDtoToModel(dto: IndustryResponseDto): IndustryModel {
    return new IndustryModel({
        createdAt: new Date(dto.createdAt),
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
        createdBy: dto.createdBy,
        id: dto.id,
        name: dto.name,
        active: dto.active,
    });
}

export function mapCountryDtoToModel(dto: CountryResponseDto): CountryModel {
    return new CountryModel({
        createdAt: new Date(dto.createdAt),
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
        createdBy: dto.createdBy,
        id: dto.id,
        name: dto.name,
        active: dto.active,
    });
}

export function mapProprietaryStructureDtoToModel(dto: ProprietaryStructureDto): ProprietaryStructureModel {
    return new ProprietaryStructureModel({
        createdAt: new Date(dto.createdAt),
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
        createdBy: dto.createdBy,
        id: dto.id,
        name: dto.name,
        active: dto.active,
    });
}

export function mapTitleDtoToModel(dto: TitleResponseDto): TitleModel {
    return new TitleModel({
        createdAt: new Date(dto.createdAt),
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
        createdBy: dto.createdBy,
        id: dto.id,
        title: dto.title,
        active: dto.active,
    });
}

export function mapJobTitleDtoToModel(dto: JobTitleResponseDto): JobTitleModel {
    return new JobTitleModel({
        createdAt: new Date(dto.createdAt),
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
        createdBy: dto.createdBy,
        id: dto.id,
        name: dto.name,
        active: dto.active,
    });
}

// Model to DTO (Works for both Request and Response DTOs)
export function mapModelToLegalStatusDto(model: LegalStatusModel): LegalStatusDto {
    return {
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        createdBy: model.createdBy,
        id: model.id,
        name: model.name,
        active: model.active,
    };
}

export function mapModelToCityDto(model: CityModel): CityResponseDto {
    return {
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        createdBy: model.createdBy,
        id: model.id,
        name: model.name,
        active: model.active,
    };
}

export function mapModelToCourtDto(model: CourtModel): CourtResponseDto {
    return {
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        createdBy: model.createdBy,
        id: model.id,
        name: model.name,
        active: model.active,
    };
}

export function mapModelToIndustryDto(model: IndustryModel): IndustryResponseDto {
    return {
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        createdBy: model.createdBy,
        id: model.id,
        name: model.name,
        active: model.active,
    };
}

export function mapModelToCountryDto(model: CountryModel): CountryResponseDto {
    return {
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        createdBy: model.createdBy,
        id: model.id,
        name: model.name,
        active: model.active,
    };
}

export function mapModelToProprietaryStructureDto(model: ProprietaryStructureModel): ProprietaryStructureDto {
    return {
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        createdBy: model.createdBy,
        id: model.id,
        name: model.name,
        active: model.active,
    };
}

export function mapModelToTitleDto(model: TitleModel): TitleResponseDto {
    return {
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        createdBy: model.createdBy,
        id: model.id,
        title: model.title,
        active: model.active,
    };
}

export function mapModelToJobTitleDto(model: JobTitleModel): JobTitleResponseDto {
    return {
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
        createdBy: model.createdBy,
        id: model.id,
        name: model.name,
        active: model.active,
    };
}
