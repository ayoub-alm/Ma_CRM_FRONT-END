export class PaymentMethodResponseDto {
  id: number;
  name: string;
  status: string;

  constructor(data:any) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
  }
}
