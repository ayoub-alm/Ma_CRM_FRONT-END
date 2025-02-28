export class RightsRequestDto {
    name!: string;
    description!: string;
    companyId!: number;

    constructor(name: string, description: string, companyId: number) {
        this.name = name;
        this.description = description;
        this.companyId = companyId;
    }
}