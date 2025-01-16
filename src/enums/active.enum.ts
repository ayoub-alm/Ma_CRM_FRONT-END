export enum ActiveEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export function getAllStatusInteraction(): string[] {
  return Object.values(ActiveEnum);
}