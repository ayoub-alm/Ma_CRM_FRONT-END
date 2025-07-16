import {StorageReasonEnum} from '../../../enums/crm/storage.reason.enum';
import {NeedStatusEnum} from '../../../enums/crm/need.status.enum';
import {LivreEnum} from '../../../enums/crm/livre.enum';
import {StockedItemCreateDto} from './stockedItem.create.dto';
import {UnloadingTypeResponseDto} from '../../response/crm/unloading.type.response.dto';
import {RequirementResponseDto} from '../../response/crm/requirement.response.dto';

export class StorageOfferCreateDto {
  id: number |string = "";
  ref: string; // UUID reference for the storage need
  storageReason: StorageReasonEnum; // Reason for storage (TEMPORARY, PERMANENT, etc.)
  status: NeedStatusEnum; // Status of the need (CREATED, NEGOTIATION, CANCELED)
  liverStatus: LivreEnum; // OPEN or CLOSE
  expirationDate: Date; // Expiration date in ISO format
  duration: number; // Duration in days or units
  numberOfSku: number; // Number of SKUs
  productType: string; // Type of product
  customerId: number; // Customer ID
  companyId: number; // Company ID
  stockedItemsRequestDto: StockedItemCreateDto[]; // List of stocked items
  unloadingTypes: UnloadingTypeResponseDto[]; // List of unloading type IDs
  requirements: RequirementResponseDto[]; // List of requirement IDs
  storageNeedId:number;
  paymentTypeIds:number[];
  paymentDeadline:number;
  interlocutorId:number
  note: string = "";
  managementFees: number = 0;
  numberOfReservedPlaces: number = 0;
  minimumBillingGuaranteed: number = 0;
  withRevision:boolean;


  constructor(
    id:number | string,
    ref: string,
    storageReason: StorageReasonEnum,
    status: NeedStatusEnum,
    liverStatus: LivreEnum,
    expirationDate: Date,
    duration: number,
    numberOfSku: number,
    productType: string,
    customerId: number,
    companyId: number,
    stockedItemsRequestDto: StockedItemCreateDto[] = [],
    unloadingTypes: UnloadingTypeResponseDto[] = [],
    requirements: RequirementResponseDto[] = [],
    storageNeedId:number,
    paymentTypeIds:number[],
    paymentDeadline:number,
    interlocutorId:number
  ) {
    this.id = id;
    this.ref = ref;
    this.storageReason = storageReason;
    this.status = status;
    this.liverStatus = liverStatus;
    this.expirationDate = expirationDate;
    this.duration = duration;
    this.numberOfSku = numberOfSku;
    this.productType = productType;
    this.customerId = customerId;
    this.companyId = companyId;
    this.stockedItemsRequestDto = stockedItemsRequestDto;
    this.unloadingTypes = unloadingTypes;
    this.requirements = requirements;
    this.storageNeedId = storageNeedId
    this.paymentTypeIds = paymentTypeIds
    this.interlocutorId = interlocutorId
    this.paymentDeadline = paymentDeadline;
    this.withRevision = false;
  }


  initializeFromObject(data:any):void{
    this.ref = data.ref;
    this.storageReason = data.storageReason;
    this.status = data.status;
    this.liverStatus = data.liverStatus;
    this.expirationDate = data.expirationDate;
    this.duration = data.duration;
    this.numberOfSku = data.numberOfSku;
    this.productType = data.productType;
    this.customerId = data.customerId;
    this.companyId = data.companyId;
    this.paymentTypeIds = data.paymentTypeIds
    this.interlocutorId = data.interlocutorId
    this.paymentDeadline = data.paymentDeadline;
    this.note = data.note;
    this.managementFees = data.managementFees;
    this.numberOfReservedPlaces = data.numberOfReservedPlaces;
    this.minimumBillingGuaranteed = data.minimumBillingGuaranteed;
  }
}



