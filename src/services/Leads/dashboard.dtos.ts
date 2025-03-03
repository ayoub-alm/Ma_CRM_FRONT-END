export interface CountsDto {
  countOfProspects: number;
  CountOfInteractions: number;
  CountOfInterlocutors: number;
}

export class DashboardCounts{
  label:string;
  count:number;

  constructor(label:string, count:number) {
    this.label = label;
    this.count = count;
  }
}

export interface CustomerCountDto {
  status?: string;
  interest?: any;
  seller?: string;
  city?: any;
  date?: string;
  industry?: any;
  count: number;
}

export interface InteractionCountDto {
  subject?: string;
  type?: string;
  seller?: string;
  count: number;
}

export interface InterlocutorCountDto {
  seller: string;
  company?: any;
  count: number;
}
