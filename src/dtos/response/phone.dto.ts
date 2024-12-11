export class PhoneDto {
  public id:number | null;
  public number:string;


  constructor(id:number | null,number:string) {
    this.id = id;
    this.number = number;
  }
}
