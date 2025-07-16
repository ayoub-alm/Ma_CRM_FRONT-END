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
import {StorageContractStatus} from './storage.contract.status';
import {StorageOfferResponseDto} from './storage.offer.response.dto';

export class StorageContractResponseDto {
  id!: number; // ID of the storage need
  ref!: string; // UUID reference of the storage contract
  number:string;
  liverStatus!: LivreEnum; // OPEN or CLOSE
  storageReason!: StorageReasonEnum; // TEMPORARY, PERMANENT, SEASONAL
  status!: StorageContractStatus; // CREATED, NEGOTIATION, CANCELED, etc.
  initialDate:Date;
  startDate:Date;
  expirationDate!: string; // Expiration date in ISO format
  renewalDate:Date;
  duration!: number; // Duration of the storage in days or units
  numberOfSku!: number; // Number of SKUs involved in the storage
  productType!: string; // Type of product being stored
  customer!: {id:number,name:string}; // Name of the associated customer
  companyName!: string; // Name of the associated company
  stockedItems: StockedItemResponseDto[];
  unloadingTypes: UnloadingTypeResponseDto[];
  requirements: RequirementResponseDto[];
  interlocutor:InterlocutorResDto;
  paymentType: PaymentMethodResponseDto;
  paymentDeadline:number;
  note:string;
  numberOfReservedPlaces:number;
  managementFees:number;
  minimumBillingGuaranteed:number;
  noticePeriod:number;
  declaredValueOfStock:number;
  insuranceValue:number;
  automaticRenewal:boolean;
  offer:StorageOfferResponseDto;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserDto;
  updatedBy: UserDto;
  pdfUrl:string;
  parentContract:StorageContractResponseDto;
  annexes:StorageContractResponseDto[];

  constructor(data: any) {
    this.id = data.id;
    this.ref = data.ref;
    this.number = data.number;
    this.liverStatus = data.liverStatus;
    this.storageReason = data.storageReason;
    this.status = data.status;
    this.initialDate = data.initialDate;
    this.startDate = data.startDate;
    this.expirationDate = data.expirationDate;
    this.renewalDate = data.renewalDate;
    this.duration = data.duration;
    this.numberOfSku = data.numberOfSku;
    this.productType = data.productType;
    this.companyName = data.customerName;
    this.customer = data.customer;
    this.companyName = data.companyName;
    this.stockedItems = data.stockedItems;
    this.unloadingTypes = data.unloadingTypes;
    this.requirements = data.requirements;
    this.interlocutor = data.interlocutor;
    this.paymentType = data.paymentType;
    this.paymentDeadline = data.paymentDeadline;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
    this.note = data.note;
    this.automaticRenewal = data.automaticRenewal;
    this.numberOfReservedPlaces = data.numberOfReservedPlaces;
    this.managementFees = data.managementFees;
    this.minimumBillingGuaranteed = data.minimumBillingGuaranteed;
    this.noticePeriod = data.noticePeriod;
    this.declaredValueOfStock = data.declaredValueOfStock;
    this.insuranceValue = data.insuranceValue;
    this.offer = data.offer;
    this.pdfUrl = data.pdfUrl;
    this.annexes = data.annexes;
    this.parentContract = data.parentContract;
  }
}
