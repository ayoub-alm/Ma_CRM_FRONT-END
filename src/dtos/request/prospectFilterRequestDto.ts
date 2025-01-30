export class ProspectFilterRequestDto {
    status: string | null = null;
    companyId: number | null = null;

    constructor(status: string | null, companyId: number | null) {
        this.status = status || null;
        this.companyId = companyId || null;
    }
}