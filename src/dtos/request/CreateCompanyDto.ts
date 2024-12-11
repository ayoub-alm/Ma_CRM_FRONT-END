import {LegalStatusDto} from "../init_data/response/legal.status.dto";
import {CityResponseDto} from "../init_data/response/city.response.dt";
import {CourtResponseDto} from "../init_data/response/court.response.dto";
import {CompanySizeResponseDto} from "../init_data/response/company.size.response.dt";
import {IndustryResponseDto} from "../init_data/response/industry.response.dt";
import {CountryResponseDto} from "../init_data/response/country.response.dto";
import {ProprietaryStructureDto} from "../init_data/response/proprietary.structure.dto";
import {TitleResponseDto} from "../init_data/response/title.response.dto";
import {JobTitleResponseDto} from "../init_data/response/job.title.response.dto";

export class CreateCompanyRequest {
  logo!: string;
  name!: string;
  sigle!: string;
  capital!: number;
  headOffice!: string;
  legalRepresentative!: string;
  yearOfCreation!: number;
  dateOfRegistration!: string;
  email!: string;
  phone!: string;
  fax!: string;
  whatsapp!: string;
  website!: string;
  linkedin!: string;
  ice!: string;
  rc!: string;
  ifm!: string;
  patent!: string;
  cnss!: string;
  certificationText!: string;
  businessDescription!: string;

  // Foreign keys assuming you have these objects with ID
  legalStatus!: LegalStatusDto;
  city!: CityResponseDto;
  court!: CourtResponseDto;
  companySize!: CompanySizeResponseDto;
  industry!: IndustryResponseDto;
  country!: CountryResponseDto;
  proprietaryStructure!: ProprietaryStructureDto;
  title!: TitleResponseDto;
  reprosentaveJobTitle!: JobTitleResponseDto;

  constructor(logo: string, name: string, sigle: string, capital: number, headOffice: string, legalRepresentative: string, yearOfCreation: number, dateOfRegistration: string, email: string, phone: string, fax: string, whatsapp: string, website: string, linkedin: string, ice: string, rc: string, ifm: string, patent: string, cnss: string, certificationText: string, businessDescription: string, legalStatus: LegalStatusDto, city: CityResponseDto, court: CourtResponseDto, companySize: CompanySizeResponseDto, industry: IndustryResponseDto, country: CountryResponseDto, proprietaryStructure: ProprietaryStructureDto, title: TitleResponseDto, reprosentaveJobTitle: JobTitleResponseDto) {
    this.logo = logo;
    this.name = name;
    this.sigle = sigle;
    this.capital = capital;
    this.headOffice = headOffice;
    this.legalRepresentative = legalRepresentative;
    this.yearOfCreation = yearOfCreation;
    this.dateOfRegistration = dateOfRegistration;
    this.email = email;
    this.phone = phone;
    this.fax = fax;
    this.whatsapp = whatsapp;
    this.website = website;
    this.linkedin = linkedin;
    this.ice = ice;
    this.rc = rc;
    this.ifm = ifm;
    this.patent = patent;
    this.cnss = cnss;
    this.certificationText = certificationText;
    this.businessDescription = businessDescription;
    this.legalStatus = legalStatus;
    this.city = city;
    this.court = court;
    this.companySize = companySize;
    this.industry = industry;
    this.country = country;
    this.proprietaryStructure = proprietaryStructure;
    this.title = title;
    this.reprosentaveJobTitle = reprosentaveJobTitle;
  }

}
