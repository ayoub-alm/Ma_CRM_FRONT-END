import {StorageReasonEnum} from '../../../enums/crm/storage.reason.enum';
import {LivreEnum} from '../../../enums/crm/livre.enum';

export class StorageOfferUpdateRequestDto {
  numberOfSku: number;
  productType: string;
  storageReason: StorageReasonEnum;
  duration: number;
  liverStatus: LivreEnum;

  constructor(data:any) {
    this.numberOfSku = data.numberOfSku;
    this.productType = data.productType;
    this.storageReason = data.storageReason;
    this.duration = data.duration;
    this.liverStatus = data.liverStatus;
  }
}
