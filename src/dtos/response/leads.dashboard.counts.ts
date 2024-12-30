export class LeadsDashboardCounts {
  public countOfProspects: number = 0;
  public countOfInteractions: number = 0;
  public countOfInterlocutors: number = 0;

  constructor(data: any) {
    this.countOfProspects = data.countOfProspects;
    this.countOfInteractions =data.countOfInteractions
    this.countOfInterlocutors = data.countOfInterlocutors;
  }
}
