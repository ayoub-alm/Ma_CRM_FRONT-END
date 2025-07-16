import {ActiveEnum} from '../../enums/active.enum';
import {EmailDto} from './email.dto';
import {PhoneDto} from './phone.dto';
import {ProspectResponseDto} from './prospect.response.dto';
import {DepartmentModel} from '../../models/department.model';
import {JobTitleResponseDto} from '../init_data/response/job.title.response.dto';
import {JobTitleService} from '../../services/data/job.title.service';
import {UserDto} from './usersResponseDto';

export class InterlocutorResDto{
  id:number;
  fullName:string;
  emailAddress:EmailDto;
  phoneNumber:PhoneDto;
  active: ActiveEnum;
  customer:ProspectResponseDto;
  department:DepartmentModel;
  jobTitle: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: string | null;
  createdBy: UserDto;
  updatedBy: UserDto;

  constructor(data: any ) {
    this.id = data.id ? data.id : '';
    this.fullName = data.fullName;
    this.emailAddress = data.emailAddress;
    this.phoneNumber = data.phoneNumber;
    this.active = data.active;
    this.customer = data.customer;
    this.department = data.department;
    this.jobTitle = data.jobTitle;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
    this.updatedAt = data.updatedAt;
    this.updatedBy = data.updatedBy;
    this.deletedAt = data.deletedAt;
  }
}
