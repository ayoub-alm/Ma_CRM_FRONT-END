import {RightsRequestDto} from "./rights.request.dto";

export class RoleRequestDto {
    name!: string;
    companyId!: number;
    rights!: RightsRequestDto[];

    constructor(name: string, companyId: number, rights: RightsRequestDto[] = []) {
        this.name = name;
        this.companyId = companyId;
        this.rights = rights;
    }
}