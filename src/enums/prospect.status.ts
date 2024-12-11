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
  return (Object.values(ProspectStatus) as string[]).includes(label)
    ? (label as ProspectStatus)
    : undefined;
}


export function getAllStatusLabel(): string[]  {
  return (Object.values(ProspectStatus) as string[])
    ? (Object.values(ProspectStatus) as string[])
    : [];
}
