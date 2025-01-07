export class interestRequestDto {
    prospectId: number;
    interestId: number;
    status: boolean;

    constructor(prospectId: number, interestId: number, status: boolean) {
        this.prospectId = prospectId;
        this.interestId = interestId;
        this.status = status;
    }
}