import {BaseModel} from "./baseModel";

export class DepartmentModel  extends BaseModel{
  constructor(id: number, createdAt: Date, updatedAt: Date, createdBy: string,public name: string,deletedAt?: Date) {
    super(id,createdAt,updatedAt,createdBy,deletedAt);
  }
}
