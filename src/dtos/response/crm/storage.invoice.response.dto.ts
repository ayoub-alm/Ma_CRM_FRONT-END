import {StockedItemResponseDto} from './stocked.itemresponse.dto';
import {ProvisionResponseDto} from './provision.response.dto';
import {StorageContractResponseDto} from './storage.contract.response.dto';
import {UserDto} from '../usersResponseDto';
import {StorageDeliveryNoteStatus} from './storage.delivery.note.status';
import {UnloadingTypeResponseDto} from './unloading.type.response.dto';
import {RequirementResponseDto} from './requirement.response.dto';
import {StorageDeliveryNoteResponseDto} from './storage.delivery.note.response.dto';
import {StorageInvoicePaymentRequestDto} from '../../request/crm/storage.invoice.payment.request.dto';

export class StorageInvoiceResponseDto {
  id!: number;
  number:string;
  status:StorageDeliveryNoteStatus;
  stockedItemResponseDtos:StockedItemResponseDtoInDeliveryNoteResponseDto[];
  unloadingTypeResponseDtos:UnloadingTypeInDeliveryNoteResponseDto[];
  requirementResponseDtos:RequirementInDeliveryNoteResponseDto[];
  storageContract:StorageContractResponseDto;
  storageDeliveryNote: StorageDeliveryNoteResponseDto;
  storageInvoicePaymentRequestDtos: StorageInvoicePaymentRequestDto[];
  totalHt: number;
  tva: number;
  totalTtc: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  invoiceDate: Date;
  createdBy: UserDto;
  updatedBy: UserDto;
  sendDate: string;
  sendStatus: string;
  returnDate: null;
  returnStatus: string;


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
    this.storageDeliveryNote = data.storageDeliveryNote;
    this.totalTtc = data.totalTtc;
    this.tva = data.tva;
    this.totalHt = data.totalHt;
    this.storageInvoicePaymentRequestDtos =  data.storageInvoicePaymentRequestDtos;
    this.sendDate = data.sendDate;
    this.sendStatus = data.sendStatus;
    this.returnDate = data.returnDate;
    this.returnStatus = data.returnStatus;
    this.dueDate = data.dueDate;
    this.invoiceDate = data.invoiceDate;
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
