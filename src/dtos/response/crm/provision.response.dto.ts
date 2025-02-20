import {DiscountTypeEnum} from '../../../enums/discount.type.enum';

export class ProvisionResponseDto {
  id: number; // ID of the provision
  name: string; // Name of the provision
  ref: string; // Reference UUID of the provision
  unitOfMeasurement: string; // Unit of measurement (e.g., "Unite")
  notes: string | null; // Optional notes for the provision
  companyId: number; // Associated company ID
  initPrice: number; // Initial price of the provision
  discountType:DiscountTypeEnum;
  discountValue:number;
  salesPrice:number;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.ref = data.ref;
    this.initPrice = data.initPrice;
    this.unitOfMeasurement = data.unitOfMeasurement;
    this.notes = data.notes;
    this.companyId = data.companyId;
    this.salesPrice = data.salesPrice;
    this.discountValue = data.discountValue;
    this.discountType = data.discountType;
  }
}
