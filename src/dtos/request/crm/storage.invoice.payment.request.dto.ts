export class StorageInvoicePaymentRequestDto {
  paymentMethod: string;
  ref: string;
  amount: number;
  invoiceId: number;
  createdAt: string;
  constructor(data:any) {
    this.paymentMethod = data.paymentMethod;
    this.ref = data.ref;
    this.amount = data.amount;
    this.invoiceId = data.invoiceId;
    this.createdAt = data.createdAt;
  }
}
