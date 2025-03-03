import {UserDto} from './usersResponseDto';

export class InteractionResponseDto {
  id: number;
  customerId: number;
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
  updatedAt: Date;
  deletedAt: string | null;
  createdBy: UserDto;
  updatedBy: UserDto;

  constructor(data: any) {
    this.id = data.id;
    this.customerId = data.customerId;
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
    this.createdBy = data.createdBy;
    this.updatedAt = data.updatedAt;
    this.updatedBy = data.updatedBy;
    this.deletedAt = data.deletedAt;
  }
}
