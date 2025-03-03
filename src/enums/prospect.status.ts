export enum ProspectStatus {
  NEW = "Nouvelle",
  QUALIFIED = "Qualifiée",
  INTERESTED = "Intéressée",
  OPPORTUNITY = "Opportunité",
  CONVERTED = "Convertie",
  DISQUALIFIED = "Disqualifiée",
  LOST = "Perdue",
  NRP = "NRP"
}

export function getStatusFromLabel(label: string): ProspectStatus  {
  return (Object.entries(ProspectStatus).find(([, value]) => value === label)?.[0] as ProspectStatus) || undefined;
}

export function getLabelFromStatus(status: string): string  {
  return ProspectStatus[status as keyof typeof ProspectStatus] || "";
}

export function getAllCustomerStatusLabel(): string[] {
  return Object.values(ProspectStatus);
}

export function getAllCustomerStatus(): string[] {
  return Object.keys(ProspectStatus);
}
