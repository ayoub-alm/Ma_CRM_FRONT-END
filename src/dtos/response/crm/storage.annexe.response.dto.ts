import {LivreEnum} from '../../../enums/crm/livre.enum';
import {StorageReasonEnum} from '../../../enums/crm/storage.reason.enum';
import {StorageContractStatus} from './storage.contract.status';
import {StockedItemResponseDto} from './stocked.itemresponse.dto';
import {UnloadingTypeResponseDto} from './unloading.type.response.dto';
import {RequirementResponseDto} from './requirement.response.dto';
import {InterlocutorResDto} from '../interlocutor.dto';
import {PaymentMethodResponseDto} from '../../init_data/response/paymentMethodResponseDto';
import {StorageOfferResponseDto} from './storage.offer.response.dto';
import {UserDto} from '../usersResponseDto';
import {StorageContractResponseDto} from './storage.contract.response.dto';

export class StorageAnnexeResponseDto{
  id!: number; // ID of the storage need
  ref!: string; // UUID reference of the storage contract
  number:string;
  storageContract: StorageContractResponseDto;
  stockedItems: StockedItemResponseDto[];
  unloadingTypes: UnloadingTypeResponseDto[];
  requirements: RequirementResponseDto[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserDto;
  updatedBy: UserDto;


  constructor(data: any) {
    this.id = data.id;
    this.ref = data.ref;
    this.number = data.number;
    this.stockedItems = data.stockedItems;
    this.unloadingTypes = data.unloadingTypes;
    this.requirements = data.requirements;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
    this.storageContract = data.storageContract;
  }
}
