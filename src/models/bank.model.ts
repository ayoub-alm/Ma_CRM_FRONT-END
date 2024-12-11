import {BaseModel} from "./baseModel";

export class BankModel  extends BaseModel{
  constructor(id: number,
              createdAt: Date,
              updatedAt: Date,
              createdBy: string,
              public name: string,
              public active: boolean,
              deletedAt?: Date) {
    super(id,createdAt,updatedAt,createdBy,deletedAt);
  }
}
