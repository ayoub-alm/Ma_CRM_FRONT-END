export class StorageContractUpdateDto {
  id: number;
  startDate: string;         // Format: 'YYYY-MM-DD'
  initialDate: string;
  noticePeriod: number;
  declaredValueOfStock: number | null;
  insuranceValue: number | null;
  paymentDeadLine: number | null;
  paymentMethodId: number | null;
  automaticRenewal:boolean | null;

  constructor(
    id: number,
    startDate: string,
    initialDate: string,
    noticePeriod: number,
    declaredValueOfStock: number | null = null,
    insuranceValue: number | null = null,
    paymentDeadLine: number | null,
     paymentMethodId: number | null,
    automaticRenewal:boolean | null
  ) {
    this.id = id;
    this.startDate = startDate;
    this.initialDate = initialDate;
    this.noticePeriod = noticePeriod;
    this.declaredValueOfStock = declaredValueOfStock;
    this.insuranceValue = insuranceValue;
    this.paymentMethodId = paymentMethodId;
    this.paymentDeadLine = paymentDeadLine;
    this.automaticRenewal = automaticRenewal
  }
}
