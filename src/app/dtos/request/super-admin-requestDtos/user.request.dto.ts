import {RoleRequestDto} from "./role.request.dto";
import {RightsRequestDto} from "./rights.request.dto";

export class UserRequestDto {
    image!: string;
    matricule!: string;
    name!: string;
    email!: string;
    password!: string;
    aboutMe!: string;
    phone!: string;
    companyId!: number;

    // Foreign keys assuming you have these objects with ID
    role!: RoleRequestDto;
    rights!: RightsRequestDto[];

    constructor(image: string,matricule: string, name: string, email: string, password: string, aboutMe: string, phone: string, companyId: number,
                role: RoleRequestDto, rights: RightsRequestDto[] = []) {
        this.image = image;
        this.matricule = matricule;
        this.name = name;
        this.password = password;
        this.email = email;
        this.aboutMe = aboutMe;
        this.phone = phone;
        this.companyId = companyId;
        this.role = role;
        this.rights = rights;
    }
}