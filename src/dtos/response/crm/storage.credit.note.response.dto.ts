import {StockedItemResponseDto} from './stocked.itemresponse.dto';
import {ProvisionResponseDto} from './provision.response.dto';
import {StorageContractResponseDto} from './storage.contract.response.dto';
import {UserDto} from '../usersResponseDto';
import {StorageDeliveryNoteStatus} from './storage.delivery.note.status';
import {UnloadingTypeResponseDto} from './unloading.type.response.dto';
import {RequirementResponseDto} from './requirement.response.dto';
import {StorageDeliveryNoteResponseDto} from './storage.delivery.note.response.dto';
import {StorageInvoicePaymentRequestDto} from '../../request/crm/storage.invoice.payment.request.dto';
import {
  RequirementInDeliveryNoteResponseDto,
  StockedItemResponseDtoInDeliveryNoteResponseDto, StorageInvoiceResponseDto, UnloadingTypeInDeliveryNoteResponseDto
} from './storage.invoice.response.dto';

export class StorageCreditNoteResponseDto {
  id!: number;
  number:string;
  status:StorageDeliveryNoteStatus;
  stockedItemResponseDtos:StockedItemResponseDtoInDeliveryNoteResponseDto[];
  unloadingTypeResponseDtos:UnloadingTypeInDeliveryNoteResponseDto[];
  requirementResponseDtos:RequirementInDeliveryNoteResponseDto[];
  storageInvoice: StorageInvoiceResponseDto;
  totalHt: number;
  tva: number;
  totalTtc: number;
  sendDate: string;
  sendStatus: string;
  returnDate: null;
  returnStatus: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserDto;
  updatedBy: UserDto;


  constructor(data:any) {
    this.id = data.id;
    this.stockedItemResponseDtos = data.stockdItemResponseDtos;
    this.unloadingTypeResponseDtos = data.unloadingTypeResponseDtos;
    this.requirementResponseDtos = data.requirementResponseDtos;
    this.number = data.number;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
    this.status = data.status;
    this.totalTtc = data.totalTtc;
    this.tva = data.tva;
    this.totalHt = data.totalHt;
    this.storageInvoice =  data.storageInvoice;
    this.sendDate = data.sendDate;
    this.sendStatus = data.sendStatus;
    this.returnDate = data.returnDate;
    this.returnStatus = data.returnStatus;
  }
}
