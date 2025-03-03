export class RequirementRequestDto{
  name:string;
  initPrice:number;
  unitOfMeasurement:string;
  companyId:number;
  constructor(name:string,initPrice:number,unit:string, companyId:number) {
    this.name = name;
    this.initPrice = initPrice;
    this.unitOfMeasurement = unit;
    this.companyId = companyId;
  }
}
