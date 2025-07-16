export class PaymentMethodResponseDto {
  id: number;
  name: string;
  status: string;
  selected: boolean;

  constructor(data:any) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.selected = data.selected;
  }
}
