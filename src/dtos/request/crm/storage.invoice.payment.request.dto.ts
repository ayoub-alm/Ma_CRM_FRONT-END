export class StorageInvoicePaymentRequestDto {
  id:number;
  paymentMethod: string;
  ref: string;
  amount: number;
  invoiceId: number;
  createdAt: string;
  receptionDate: Date;
  validationDate: Date;
  validationStatus: boolean;
  constructor(data:any) {
    this.id = data.id;
    this.paymentMethod = data.paymentMethod;
    this.ref = data.ref;
    this.amount = data.amount;
    this.invoiceId = data.invoiceId;
    this.createdAt = data.createdAt;
    this.receptionDate = data.receptionDate;
    this.validationDate = data.receptionDate;
    this.validationStatus = data.receptionStatus;
  }
}
