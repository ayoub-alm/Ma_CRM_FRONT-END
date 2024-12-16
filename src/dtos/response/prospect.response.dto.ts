import {LegalStatusDto} from "../init_data/response/legal.status.dto";
import {CityResponseDto} from "../init_data/response/city.response.dt";
import {CourtResponseDto} from "../init_data/response/court.response.dto";
import {CompanySizeResponseDto} from "../init_data/response/company.size.response.dt";
import {IndustryResponseDto} from "../init_data/response/industry.response.dt";
import {CountryResponseDto} from "../init_data/response/country.response.dto";
import {ProprietaryStructureDto} from "../init_data/response/proprietary.structure.dto";
import {JobTitleResponseDto} from "../init_data/response/job.title.response.dto";
import {TitleResponseDto} from "../init_data/response/title.response.dto";
import {ProspectStatus} from '../../enums/prospect.status';
import {TrackingLogResponseDto} from './tracking.log.response.dto';
export class ProspectResponseDto {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  id: number;
  logo: string | null;
  name: string;
  sigle: string;
  capital: string;
  headOffice: string;
  legalRepresentative: string;
  yearOfCreation: string;
  dateOfRegistration: string;
  email: string;
  phone: string;
  fax: string;
  whatsapp: string;
  website: string;
  linkedin: string;
  ice: string;
  rc: string;
  ifm: string;
  patent: string;
  cnss: string;
  prospectStatus: ProspectStatus;
  status: ProspectStatus;
  businessDescription: string;
  legalStatus: LegalStatusDto | null;
  city: CityResponseDto | null;
  court: CourtResponseDto | null;
  companySize: CompanySizeResponseDto | null;
  industry: IndustryResponseDto | null;
  country: CountryResponseDto | null;
  proprietaryStructure: ProprietaryStructureDto | null ;
  title: TitleResponseDto | null;
  reprosentaveJobTitle: JobTitleResponseDto | null;
  certificationText: string | null;
  trackingLogs: TrackingLogResponseDto[];


  constructor(data: any) {
    this.createdAt = data?.createdAt || '';
    this.updatedAt = data?.updatedAt || '';
    this.deletedAt = data?.deletedAt || null;
    this.createdBy = data?.createdBy || null;
    this.id = data?.id || 0;
    this.logo = data?.logo || '';
    this.name = data?.name || '';
    this.sigle = data?.sigle || '';
    this.capital = data?.capital || '';
    this.headOffice = data?.headOffice || '';
    this.legalRepresentative = data?.legalRepresentative || '';
    this.yearOfCreation = data?.yearOfCreation || '';
    this.dateOfRegistration = data?.dateOfRegistration || '';
    this.email = data?.email || '';
    this.phone = data?.phone || '';
    this.fax = data?.fax || '';
    this.whatsapp = data?.whatsapp || '';
    this.website = data?.website || '';
    this.linkedin = data?.linkedin || '';
    this.ice = data?.ice || '';
    this.rc = data?.rc || '';
    this.ifm = data?.ifm || '';
    this.patent = data?.patent || '';
    this.cnss = data?.cnss || '';
    this.businessDescription = data?.businessDescription || '';
    this.legalStatus = data?.legalStatus ? new LegalStatusDto(data.legalStatus) : null;
    this.city = data?.city ? new CityResponseDto(data.city) : null;
    this.court = data?.court ? new CourtResponseDto(data.court) : null;
    this.companySize = data?.companySize ? new CompanySizeResponseDto(data.companySize) : null;
    this.industry = data?.industry ? new IndustryResponseDto(data.industry) : null;
    this.country = data?.country ? new CountryResponseDto(data.country) : null;
    this.proprietaryStructure = data?.proprietaryStructure
      ? new ProprietaryStructureDto(data.proprietaryStructure)
      : null;
    this.title = data?.title ? new TitleResponseDto(data.title) : null;
    this.reprosentaveJobTitle = data?.reprosentaveJobTitle
      ? new (data.reprosentaveJobTitle)
      : null;
    this.certificationText = data?.certificationText || null;
    this.status = data?.status;
    this.prospectStatus = data?.prospectStatus;
    this.trackingLogs = data?.trackingLogs;
  }
}
