export class CompanySizeModel {
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    createdBy: string;
    id: number;
    name: string;
    active: boolean;

    constructor(data: any) {
        if (!data) {
            this.createdAt = new Date();
            this.updatedAt = null;
            this.deletedAt = null;
            this.createdBy = '';
            this.id = 0;
            this.name = '';
            this.active = false;
            return;
        }
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
        this.createdBy = data.createdBy || '';
        this.id = data.id || 0;
        this.name = data.name || '';
        this.active = data.active ?? false;
    }
}
