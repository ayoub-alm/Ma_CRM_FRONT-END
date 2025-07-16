import {PhoneDto} from '../../response/phone.dto';
import {EmailDto} from '../../response/email.dto';
import {ActiveEnum} from '../../../enums/active.enum';

export class InterlocutorRequestDto {
  id: number | null = null;
  fullName: string;
  prospectId: number;
  departmentId: number |null;
  phoneNumber: PhoneDto;
  emailAddress: EmailDto;
  jobTitle: string | null;
  active: ActiveEnum;

  constructor(id: number | null,
  fullName: string,
  prospectId: number,
  departmentId: number,
  phoneNumber: PhoneDto,
  emailAddress: EmailDto,
  jobTitle: string,
  active: ActiveEnum) {
    this.id = id || null;
    this.fullName =fullName || '';
    this.prospectId =prospectId ;
    this.departmentId =departmentId || null;
    this.phoneNumber =phoneNumber || '';
    this.emailAddress =emailAddress || '';
    this.jobTitle = jobTitle || null;
    this.active = active || ActiveEnum.ACTIVE;
  }
}
