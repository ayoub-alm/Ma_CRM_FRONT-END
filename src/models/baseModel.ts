export class BaseModel {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    createdBy: string;

    constructor(id: number, createdAt: Date, updatedAt: Date, createdBy: string,deletedAt?: Date) {
      this.id = id;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.deletedAt = deletedAt;
      this.createdBy = createdBy
    }
}
