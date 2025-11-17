export class RightsRequestDto {
    name!: string;
    description!: string;
    companyId!: number | null;

    constructor(name: string, description: string, companyId: number | null = null) {
        this.name = name;
        this.description = description;
        this.companyId = companyId;
    }
}