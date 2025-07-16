export class ProvisionRequestDto{
  id:number;
  name:string;
  initPrice:number;
  unitOfMeasurement:string;
  order: number;
  companyId:number;
  constructor(id:number,name:string,initPrice:number,unit:string,order:number, companyId:number) {
    this.id = id;
    this.name = name;
    this.initPrice = initPrice;
    this.unitOfMeasurement = unit;
    this.order = order;
    this.companyId = companyId;
  }
}
