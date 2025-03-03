
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {LegalStatusDto} from '../../init_data/response/legal.status.dto';
import { CityResponseDto } from '../../init_data/response/city.response.dt';
import { CourtResponseDto } from '../../init_data/response/court.response.dto';
import {IndustryResponseDto} from '../../init_data/response/industry.response.dt';
import {CompanySizeResponseDto} from '../../init_data/response/company.size.response.dt';
import {CountryResponseDto} from '../../init_data/response/country.response.dto';
import {ProprietaryStructureDto} from '../../init_data/response/proprietary.structure.dto';
import {TitleResponseDto} from '../../init_data/response/title.response.dto';
import {JobTitleResponseDto} from '../../init_data/response/job.title.response.dto';

export class CreateProspectDto {
  id!:number | string;
  // logo!: string;
  name!: (string | ((control: AbstractControl) => (ValidationErrors | null)) | undefined)[];
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
  companyId:number;

  constructor(id: number | string, logo: string, name: (string | ((control: AbstractControl) => (ValidationErrors | null)) | undefined)[],
              sigle: string, capital: number, headOffice: string, legalRepresentative: string, yearOfCreation: number,
              dateOfRegistration: string, email: string, phone: string, fax: string, whatsapp: string, website: string,
              linkedin: string, ice: string, rc: string, ifm: string, patent: string, cnss: string, certificationText: string,
              businessDescription: string, legalStatus: LegalStatusDto | null, city: CityResponseDto | null,
              court: CourtResponseDto | null, companySize: CompanySizeResponseDto | null,
              industry: IndustryResponseDto | null, country: CountryResponseDto | null, proprietaryStructure: ProprietaryStructureDto | null,
              title: TitleResponseDto | null, reprosentaveJobTitle: JobTitleResponseDto | null, companyId: number) {
    this.id = id ? id : "";
    // this.logo = logo;
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
    this.legalStatus = legalStatus ? legalStatus: {} as  LegalStatusDto;
    this.city = city ? city : {} as  CityResponseDto;
    this.court = court ? court : {} as  CourtResponseDto;
    this.companySize = companySize ? companySize: {} as  CompanySizeResponseDto;
    this.industry = industry ? industry : {} as  IndustryResponseDto;
    this.country = country ? country : {} as  CountryResponseDto;
    this.proprietaryStructure = proprietaryStructure ? proprietaryStructure : {} as  ProprietaryStructureDto;
    this.title = title ? title : {} as  TitleResponseDto;
    this.reprosentaveJobTitle = reprosentaveJobTitle ? reprosentaveJobTitle : {} as JobTitleResponseDto;
    this.companyId = companyId;
  }

}
