export class TitleResponseDto{
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  createdBy: string;
  id: number;
  title: string;
  active: boolean;

  constructor(data: any) {
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
    this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
    this.createdBy = data.createdBy;
    this.id = data.id;
    this.title = data.title;
    this.active = data.active;
  }
}
