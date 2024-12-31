export class ProspectCountDto {
  private _status: string;
  private _count: number;
  constructor(data:any) {
    this._status = data._status;
    this._count = data._count;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }
}
