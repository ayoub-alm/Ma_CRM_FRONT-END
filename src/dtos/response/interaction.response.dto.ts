export class InteractionResponseDto {
  id: number;
  prospectId: number;
  prospectName: string;
  interlocutorId?: number;
  interlocutorName?: string;
  report?: string;
  interactionSubject: string; // Enum string value (InteractionSubject)
  interactionType: string; // Enum string value (InteractionType)
  previousInteractionId?: number;
  planningDate?: string; // ISO 8601 Date String
  joinFilePath?: string;
  address?: string;
  agentId?: number;
  agentName?: string;
  affectedToId?: number;
  affectedToName?: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.prospectId = data.prospectId;
    this.prospectName = data.prospectName;
    this.interlocutorId = data.interlocutorId;
    this.interlocutorName = data.interlocutorName;
    this.report = data.report;
    this.interactionSubject = data.interactionSubject;
    this.interactionType = data.interactionType;
    this.previousInteractionId = data.previousInteractionId;
    this.planningDate = data.planningDate;
    this.joinFilePath = data.joinFilePath;
    this.address = data.address;
    this.agentId = data.agentId;
    this.agentName = data.agentName;
    this.affectedToId = data.affectedToId;
    this.affectedToName = data.affectedToName;
    this.createdAt = data.createdAt;
  }
}
