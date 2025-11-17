export class RoleRequestDto {
    role!: string;
    description!: string;
    companyId!: number | null;

    constructor(role: string, description: string, companyId: number | null = null) {
        this.role = role;
        this.description = description;
        this.companyId = companyId;
    }
}