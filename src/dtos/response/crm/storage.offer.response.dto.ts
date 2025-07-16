import { LivreEnum } from '../../../enums/crm/livre.enum';
import { NeedStatusEnum } from '../../../enums/crm/need.status.enum';
import { StorageReasonEnum } from '../../../enums/crm/storage.reason.enum';
import {StockedItemCreateDto} from '../../request/crm/stockedItem.create.dto';
import {StockedItemResponseDto} from './stocked.itemresponse.dto';
import {UnloadingTypeResponseDto} from './unloading.type.response.dto';
import {RequirementResponseDto} from './requirement.response.dto';
import {InterlocutorResDto} from '../interlocutor.dto';
import {PaymentMethodResponseDto} from '../../init_data/response/paymentMethodResponseDto';
import {UserDto} from '../usersResponseDto';
import {StorageOfferStatus} from './storage.offer.status';
import {StorageNeedResponseDto} from './storage.need.response.dto';

export class StorageOfferResponseDto {
  id!: number; // ID of the storage need
  ref!: string; // UUID reference of the storage need
  number:string;
  liverStatus!: LivreEnum; // OPEN or CLOSE
  storageReason!: StorageReasonEnum; // TEMPORARY, PERMANENT, SEASONAL
  status!: StorageOfferStatus; // CREATED, NEGOTIATION, CANCELED, etc.
  expirationDate!: string; // Expiration date in ISO format
  duration!: number; // Duration of the storage in days or units
  numberOfSku!: number; // Number of SKUs involved in the storage
  productType!: string; // Type of product being stored
  customer!: {id:number,name:string}; // Name of the associated customer
  companyName!: string; // Name of the associated company
  stockedItems: StockedItemResponseDto[];
  unloadingTypes: UnloadingTypeResponseDto[];
  requirements: RequirementResponseDto[];
  interlocutor:InterlocutorResDto;
  paymentTypes: PaymentMethodResponseDto[];
  storageNeed:StorageNeedResponseDto;
  paymentDeadline:number;
  note:string;
  numberOfReservedPlaces:number;
  managementFees:number;
  minimumBillingGuaranteed:number;
  minimumBillingGuaranteedFixed:number;
  maxDisCountValue:number;
  devise:string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserDto;
  updatedBy: UserDto;

  constructor(data: any) {
    this.id = data.id;
    this.ref = data.ref;
    this.number = data.number;
    this.liverStatus = data.liverStatus;
    this.storageReason = data.storageReason;
    this.status = data.status;
    this.expirationDate = data.expirationDate;
    this.duration = data.duration;
    this.numberOfSku = data.numberOfSku;
    this.productType = data.productType;
    this.companyName = data.customerName;
    this.customer = data.customer;
    this.companyName = data.companyName;
    this.stockedItems = data.stockedItems.map((item: any) => new StockedItemResponseDto(item));
    this.unloadingTypes = data.unloadingTypes;
    this.requirements = data.requirements;
    this.interlocutor = data.interlocutor;
    this.paymentTypes = data.paymentType;
    this.paymentDeadline = data.paymentDeadline;
    this.note = data.note;
    this.numberOfReservedPlaces = data.numberOfReservedPlaces;
    this.managementFees = data.managementFees;
    this.minimumBillingGuaranteed = data.minimumBillingGuaranteed;
    this.minimumBillingGuaranteedFixed = data.minimumBillingGuaranteedFixed;
    this.storageNeed = data.storageNeed;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
    this.maxDisCountValue = data.maxDisCountValue;
    this.devise = data.devise;
  }
}
