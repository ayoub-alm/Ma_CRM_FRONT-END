export class RequirementResponseDto {
  id: number;                     // Long in Java maps to number in TypeScript
  ref: string;                    // UUID in Java maps to string in TypeScript
  name: string;
  initPrice: number;              // Double in Java maps to number in TypeScript
  unitOfMeasurement: string;
  status: boolean;                // Boolean in Java maps to boolean in TypeScript
  companyId: number;              // Long in Java maps to number in TypeScript
  companyName: string;
  discount:string;
  discountValue:number;
  salesPrice:number;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.ref = data.ref;
    this.initPrice = data.initPrice;
    this.unitOfMeasurement = data.unitOfMeasurement;
    this.status = data.status;
    this.companyId = data.companyId;
    this.companyName = data.companyName;
    this.salesPrice = data.salesPrice ? data.salesPrice:  0 ;
    this.discountValue = data.remiseValue;
    this.discount = data.remise;
  }
}
