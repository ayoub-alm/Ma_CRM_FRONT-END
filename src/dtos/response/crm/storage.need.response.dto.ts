import { LivreEnum } from '../../../enums/crm/livre.enum';
import { NeedStatusEnum } from '../../../enums/crm/need.status.enum';
import { StorageReasonEnum } from '../../../enums/crm/storage.reason.enum';
import {StockedItemCreateDto} from '../../request/crm/stockedItem.create.dto';
import {StockedItemResponseDto} from './stocked.itemresponse.dto';
import {UnloadingTypeResponseDto} from './unloading.type.response.dto';
import {RequirementResponseDto} from './requirement.response.dto';
import {InterlocutorResDto} from '../interlocutor.dto';

export class StorageNeedResponseDto {
  id!: number; // ID of the storage need
  ref!: string; // UUID reference of the storage need
  liverStatus!: LivreEnum; // OPEN or CLOSE
  storageReason!: StorageReasonEnum; // TEMPORARY, PERMANENT, SEASONAL
  status!: NeedStatusEnum; // CREATED, NEGOTIATION, CANCELED, etc.
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

  constructor(data: any) {
    this.id = data.id;
    this.ref = data.ref;
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
    this.stockedItems = data.stockedItems;
    this.unloadingTypes = data.unloadingTypes;
    this.requirements = data.requirements;
    this.interlocutor = data.interlocutor
  }
}
