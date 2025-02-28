export class RightsModel {
    id!: number;
    name!: string;
    description!: string;
    companyId!: number;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.companyId = data.companyId;
    }
}