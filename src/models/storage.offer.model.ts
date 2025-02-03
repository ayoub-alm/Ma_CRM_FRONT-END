import {StorageReasonEnum} from '../enums/crm/storage.reason.enum';
import {NeedStatusEnum} from '../enums/crm/need.status.enum';
import {LivreEnum} from '../enums/crm/livre.enum';
import {StockedItemCreateDto} from '../dtos/request/crm/stockedItem.create.dto';

export class StorageOfferModel{
  id: number | null | undefined;
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
  unloadingTypes: number[]; // List of unloading type IDs
  requirements: number[]; // List of requirement IDs

   constructor(
    id: number | null,
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
    unloadingTypes: number[] = [],
    requirements: number[] = [],
  ) {
    this.id =id;
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
  }


  public createFromObject(data:any): void{
    {
      this.id =data.id;
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
      this.stockedItemsRequestDto = data.stockedItemsRequestDto;
      this.unloadingTypes = data.unloadingTypes;
      this.requirements = data.requirements;
    }
  }

  static createFromObject(data:any) {

    return undefined;
  }
}



