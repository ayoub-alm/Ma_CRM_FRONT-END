import {RightsResponseDto} from "./rights.response.dto";

export class RoleResponseDto {
    id!: number
    name!: string;
    rights!: RightsResponseDto[];

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.rights = data?.rights ? data.rights.map((right: any) => new RightsResponseDto(right)) : [];
    }
}