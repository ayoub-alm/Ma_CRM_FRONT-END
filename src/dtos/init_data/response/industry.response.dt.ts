export class IndustryResponseDto{
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  createdBy: string;
  id: number;
  name: string;
  active: boolean;

  constructor(data: any) {
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
    this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
    this.createdBy = data.createdBy;
    this.id = data.id;
    this.name = data.name;
    this.active = data.active;
  }
}
