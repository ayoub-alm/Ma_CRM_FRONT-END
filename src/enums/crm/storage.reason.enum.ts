import {ProspectStatus} from '../prospect.status';

export enum StorageReasonEnum {
  OVERFLOW = 'Débord',
  OUTSOURCING = 'Externalisation',
}

export function getLabelFromStorageReasonEnum(status: string): string | undefined {
  return StorageReasonEnum[status as keyof typeof StorageReasonEnum] || undefined;
}
