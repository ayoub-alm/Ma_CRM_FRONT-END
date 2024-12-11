export class ProjectDto {
  private _createdAt: string;
  private _updatedAt: string;
  private _deletedAt: string | null;
  private _createdBy: string;
  private _id: number;
  private _name: string;
  private _active: boolean;

  constructor(createdAt: string, updatedAt: string, deletedAt: string | null, createdBy: string, id: number, name: string, active: boolean) {
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
    this._createdBy = createdBy;
    this._id = id;
    this._name = name;
    this._active = active;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  set updatedAt(value: string) {
    this._updatedAt = value;
  }

  get deletedAt(): string | null {
    return this._deletedAt;
  }

  set deletedAt(value: string | null) {
    this._deletedAt = value;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  set createdBy(value: string) {
    this._createdBy = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

}
