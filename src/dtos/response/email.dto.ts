export class EmailDto {
  id:number | null;
  address:string;
  type:string;

  constructor(id:number | null, address:string, type:string) {
    this.id = id;
    this.address = address;
    this.type = type;
  }
}
