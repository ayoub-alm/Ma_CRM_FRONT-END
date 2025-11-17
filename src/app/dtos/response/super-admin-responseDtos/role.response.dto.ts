export class RoleResponseDto {
    id!: number;
    role: string;
    description: string;
    companyId!: number | null;

    constructor(data: any) {
        this.id = data.id;
        this.role = data.role || '';
        this.description = data.description || '';
        this.companyId = data.companyId || null;
    }
}