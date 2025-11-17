import {RoleModel} from "./role.model";
import {RightsModel} from "./rights.model";
import {CompanyModel} from "./company.model";

export class UserModel {
    id!: number;
    logo!: string;
    name!: string;
    matriculate!: string;
    email!: string;
    password!: string;
    aboutMe!: string;
    phone!: string;
    role!: RoleModel | null;
    rights!: RightsModel[];
    companies!: CompanyModel[];

    constructor(data: any) {
        this.id = data.id;
        this.logo = data.logo || '';
        this.matriculate = data.matriculate || '';
        this.name = data.name || '';
        this.email = data.email || '';
        this.password = data.password || '';
        this.aboutMe = data.aboutMe || '';
        this.phone = data.phone || '';
        this.role = data.role ? new RoleModel(data.role) : null;
        this.rights = data?.rights ? data.rights.map((right: any) => new RightsModel(right)) : [];
        this.companies = data?.companies ? data.companies.map((company: any) => new CompanyModel(company)) : [];
    }
}