import {RoleResponseDto} from "./role.response.dto";
import {RightsResponseDto} from "./rights.response.dto";

export class UserResponseDto {
    id!: number;
    image!: string;
    matricule!: string;
    name!: string;
    lastName!: string;
    departementId!: number;
    email!: string;
    password!: string;
    aboutMe!: string;
    phone!: string;

    // Foreign keys assuming you have these objects with ID
    role!: RoleResponseDto;
    rights!: RightsResponseDto[];

    constructor(data: any) {
        this.id = data.id;
        this.image = data.image;
        this.matricule = data.matricule;
        this.name = data.name;
        this.lastName = data.lastName;
        this.departementId = data.departementId;
        this.password = data.password;
        this.email = data.email;
        this.aboutMe = data.aboutMe;
        this.phone = data.phone;
        this.role = new RoleResponseDto(data.role);
        this.rights = data?.rights ? data.rights.map((right: any) => new RightsResponseDto(right)) : [];
    }
}