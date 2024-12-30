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

export function getStatusFromLabel(label: string): ProspectStatus | undefined {
  return (Object.entries(ProspectStatus).find(([, value]) => value === label)?.[0] as ProspectStatus) || undefined;
}

export function getLabelFromStatus(status: string): string | undefined {
  return ProspectStatus[status as keyof typeof ProspectStatus] || undefined;
}

export function getAllStatusLabel(): string[] {
  return Object.values(ProspectStatus);
}
