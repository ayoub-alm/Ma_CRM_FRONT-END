import {StockedItemResponseDto} from './stocked.itemresponse.dto';
import {ProvisionResponseDto} from './provision.response.dto';
import {StorageContractResponseDto} from './storage.contract.response.dto';
import {UserDto} from '../usersResponseDto';
import {StorageDeliveryNoteStatus} from './storage.delivery.note.status';
import {UnloadingTypeResponseDto} from './unloading.type.response.dto';
import {RequirementResponseDto} from './requirement.response.dto';
import {StorageDeliveryNoteUpdateRequestDto} from './storage.delivery.note.update.request.dto';
import {StorageInvoiceResponseDto} from './storage.invoice.response.dto';

export class StorageDeliveryNoteResponseDto{
  id!: number;
  number:string;
  status:StorageDeliveryNoteStatus;
  stockedItemResponseDtos:StockedItemResponseDtoInDeliveryNoteResponseDto[];
  unloadingTypeResponseDtos:UnloadingTypeInDeliveryNoteResponseDto[];
  requirementResponseDtos:RequirementInDeliveryNoteResponseDto[];
  storageContract:StorageContractResponseDto;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserDto;
  updatedBy: UserDto;
  storageDeliveryNoteUpdateRequests: StorageDeliveryNoteUpdateRequestDto[];
  storageInvoiceResponseDtos: StorageInvoiceResponseDto[];

  constructor(data:any) {
    this.id = data.id;
    this.stockedItemResponseDtos = data.stockdItemResponseDtos;
    this.unloadingTypeResponseDtos = data.unloadingTypeResponseDtos;
    this.requirementResponseDtos = data.requirementResponseDtos;
    this.number = data.number;
    this.storageContract = data.storageContract;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
    this.status = data.status;
    this.storageDeliveryNoteUpdateRequests = data.storageDeliveryNoteUpdateRequests;
    this.storageInvoiceResponseDtos = data.storageInvoiceResponseDtos;
  }
}


export class StockedItemResponseDtoInDeliveryNoteResponseDto{
  stockedItemResponseDto: StockedItemResponseDto;
  provisionResponseDto : ProvisionResponseDto;
  quantity: number;

  constructor(data:any) {
    this.stockedItemResponseDto = data.stockedItemResponseDto;
    this.provisionResponseDto  = data.provisionResponseDto;
    this.quantity = data.quantity;
  }
}

export class UnloadingTypeInDeliveryNoteResponseDto{
  id:number;
  unloadingTypeResponseDto:UnloadingTypeResponseDto;
  quantity: number;

  constructor(data:any) {
    this.id = data.id;
    this.unloadingTypeResponseDto = data.unloadingTypeResponseDto;
    this.quantity = data.quantity;
  }
}

export class RequirementInDeliveryNoteResponseDto{
  id:number;
  requirementResponseDto:RequirementResponseDto;
  quantity: number;

  constructor(data:any) {
    this.id = data.id
    this.requirementResponseDto = data.requirementResponseDto;
    this.quantity = data.quantity;
  }
}
