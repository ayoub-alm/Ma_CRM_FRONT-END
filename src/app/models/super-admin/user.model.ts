import {RoleModel} from "./role.model";
import {RightsModel} from "./rights.model";

export class UserModel {
    id!: number;
    image!: string;
    name!: string;
    matricule!: string;
    email!: string;
    password!: string;
    aboutMe!: string;
    phone!: string;
    companyId!: number;
    role!: RoleModel;
    rights!: RightsModel[];

    constructor(data: any) {
        this.id = data.id;
        this.image = data.image;
        this.matricule = data.matricule;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.aboutMe = data.aboutMe;
        this.phone = data.phone;
        this.companyId = data.companyId;
        this.role = new RoleModel(data.role);
        this.rights = data?.rights ? data.rights.map((right: any) => new RightsModel(right)) : [];
    }
}