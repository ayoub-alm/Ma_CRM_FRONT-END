export class InterestResponseDto {
    id: number;
    companyId: number;
    name: string;
    status: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.companyId = data.companyId;
        this.name = data.name;
        this.status = data.status;
    }
}