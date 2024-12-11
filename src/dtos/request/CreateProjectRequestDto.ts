export class CreateProjectRequestDto {
    name: string;
    companyId:number;

    constructor(name: string, companyId:number) {
      this.name = name;
      this.companyId = companyId;
    }
}
