import {RightsModel} from "./rights.model";

export class RoleModel {
    id!: number;
    name!: string;
    companyId!: number;
    rights!: RightsModel[];

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.companyId = data.companyId;
        this.rights = data?.rights ? data.rights.map((right: any) => new RightsModel(right)) : [];
    }
}