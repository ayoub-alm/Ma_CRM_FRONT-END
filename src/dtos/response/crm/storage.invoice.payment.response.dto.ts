import {StorageInvoiceResponseDto} from './storage.invoice.response.dto';
import {UserDto} from '../usersResponseDto';
import {UserModel} from '../../../models/user.model';

export class StorageInvoicePaymentResponseDto{
    id: number;
    ref: string;
    paymentMethod: string;
    amount : number;
    receptionDate: string;
    validationDate: Date;
    validationStatus: boolean;
    storageInvoices: StorageInvoiceResponseDto[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: UserDto;
    updatedBy: UserDto;
    constructor(data: any) {
      this.id = data.id;
      this.ref = data.ref;
      this.paymentMethod = data.paymentMethod;
      this.amount = data.amount;
      this.receptionDate = data.receptionDate;
      this.validationDate = data.receptionDate;
      this.validationStatus = data.receptionStatus;
      this.storageInvoices = data.storageInvoices;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.createdBy = data.createdBy;
      this.updatedBy = data.updatedBy;
    }
}
