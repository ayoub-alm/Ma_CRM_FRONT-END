export class ProspectInterestResponseDto {
    id: number;
    name: string;
    prospectId: number;
    interestId: number;
    status: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.status = data.status;
        this.prospectId = data.prospectId;
        this.interestId = data.interestId;
    }
}