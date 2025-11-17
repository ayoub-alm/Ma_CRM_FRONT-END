export class UserRequestDto {
    logo!: string;
    matriculate!: string;
    name!: string;
    email!: string;
    password!: string;
    aboutMe!: string;
    phone!: string;

    // Foreign keys - using IDs instead of full objects
    roleId!: number | null;
    rightIds!: number[];
    companyIds!: number[];

    constructor(logo: string, matriculate: string, name: string, email: string, password: string, aboutMe: string, phone: string,
                roleId: number | null, rightIds: number[] = [], companyIds: number[] = []) {
        this.logo = logo;
        this.matriculate = matriculate;
        this.name = name;
        this.email = email;
        this.password = password;
        this.aboutMe = aboutMe;
        this.phone = phone;
        this.roleId = roleId;
        this.rightIds = rightIds;
        this.companyIds = companyIds;
    }
}