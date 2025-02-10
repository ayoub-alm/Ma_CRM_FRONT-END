import { CompanyModel } from '../../models/super-admin/company.model';
import { CreateCompanyRequest } from '../../../dtos/request/CreateCompanyDto';
import { CompanyResponseDto } from '../../../dtos/response/CompanyResponseDto';
import { LegalStatusModel } from '../../models/init_data_models/legalStatus.model';
import { CityModel } from '../../models/init_data_models/city.model';
import { CourtModel } from '../../models/init_data_models/court.model';
import { IndustryModel } from '../../models/init_data_models/industry.model';
import { CountryModel } from '../../models/init_data_models/country.model';
import { ProprietaryStructureModel } from '../../models/init_data_models/proprietaryStructure.model';
import { TitleModel } from '../../models/init_data_models/title.model';
import { JobTitleModel } from '../../models/init_data_models/jobTitle.model';
import { CompanySizeModel } from '../../models/init_data_models/companySize.model';

/**
 * Mapper to convert between CompanyModel, CompanyResponseDto, and CreateCompanyRequest.
 */
export class CompanyMapper {

    /**
     * Converts a CompanyResponseDto into a CompanyModel.
     * @param dto The CompanyResponseDto object from the API.
     * @returns The CompanyModel object.
     */
    static fromDto(dto: CompanyResponseDto): CompanyModel {
        return new CompanyModel({
            createdAt: new Date(dto.createdAt),
            updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
            deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
            createdBy: dto.createdBy,
            id: dto.id,
            logo: dto.logo,
            name: dto.name,
            sigle: dto.sigle,
            capital: dto.capital,
            headOffice: dto.headOffice,
            legalRepresentative: dto.legalRepresentative,
            yearOfCreation: dto.yearOfCreation,
            dateOfRegistration: dto.dateOfRegistration,
            email: dto.email,
            phone: dto.phone,
            fax: dto.fax,
            whatsapp: dto.whatsapp,
            website: dto.website,
            linkedin: dto.linkedin,
            ice: dto.ice,
            rc: dto.rc,
            ifm: dto.ifm,
            patent: dto.patent,
            cnss: dto.cnss,
            businessDescription: dto.businessDescription,
            legalStatus: new LegalStatusModel(dto.legalStatus),
            city: new CityModel(dto.city),
            court: new CourtModel(dto.court),
            companySize: new CompanySizeModel(dto.companySize),
            industry: new IndustryModel(dto.industry),
            country: new CountryModel(dto.country),
            proprietaryStructure: new ProprietaryStructureModel(dto.proprietaryStructure),
            title: new TitleModel(dto.title),
            reprosentaveJobTitle: new JobTitleModel(dto.reprosentaveJobTitle),
            certificationText: dto.certificationText,
        });
    }

    /**
     * Converts a CompanyModel to a CreateCompanyRequest for sending to the API.
     * @param model The CompanyModel object.
     * @returns The CreateCompanyRequest object.
     */
    static toDto(model: CompanyModel): CreateCompanyRequest {
        return new CreateCompanyRequest(
            model.logo,
            model.name,
            model.sigle,
            model.capital,
            model.headOffice,
            model.legalRepresentative,
            model.yearOfCreation,
            model.dateOfRegistration,
            model.email,
            model.phone,
            model.fax,
            model.whatsapp,
            model.website,
            model.linkedin,
            model.ice,
            model.rc,
            model.ifm,
            model.patent,
            model.cnss,
            model.certificationText ?? '',
            model.businessDescription,
            model.legalStatus,
            model.city,
            model.court,
            model.companySize,
            model.industry,
            model.country,
            model.proprietaryStructure,
            model.title,
            model.reprosentaveJobTitle
        );
    }
}