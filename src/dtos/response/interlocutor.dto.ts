import {ActiveEnum} from '../../enums/active.enum';
import {EmailDto} from './email.dto';
import {PhoneDto} from './phone.dto';
import {ProspectResponseDto} from './prospect.response.dto';
import {DepartmentModel} from '../../models/department.model';
import {JobTitleResponseDto} from '../init_data/response/job.title.response.dto';
import {JobTitleService} from '../../services/data/job.title.service';

export class InterlocutorResDto{
  id:number;
  fullName:string;
  emailAddress:EmailDto;
  phoneNumber:PhoneDto;
  active: ActiveEnum;
  prospect:ProspectResponseDto;
  department:DepartmentModel;
  jobTitle: JobTitleResponseDto;


  constructor(data: any ) {
    this.id = data.id ? data.id : '';
    this.fullName = data.fullName;
    this.emailAddress = data.emailAddress;
    this.phoneNumber = data.phoneNumber;
    this.active = data.active;
    this.prospect = data.prospect;
    this.department = data.department;
    this.jobTitle = data.jobTitle;
  }
}
