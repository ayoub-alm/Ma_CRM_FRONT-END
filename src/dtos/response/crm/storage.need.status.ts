export class StorageNeedStatus {
  constructor(public id: number, public name: string, public order: number, public color: string,
              public backgroundColor: string, public deletedAt?: string | null,) {
  }
}
