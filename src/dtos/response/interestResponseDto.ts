export class InterestResponseDto {
    id: number;
    prospectId: number;
    nameInterest: string;
    status: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.prospectId = data.prospectId;
        this.nameInterest = data.nameInterest;
        this.status = data.status;
    }
}