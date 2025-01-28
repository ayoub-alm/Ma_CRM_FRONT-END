export class TemperatureResponseDto {
  id: number;
  name: string;
  private ref: string;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.ref = data.ref;
  }
}
