export interface InteractionRequestDto {
  customerId: number;
  interlocutorId?: number;
  report?: string;
  interactionSubject: string; // Enum string value (InteractionSubject)
  interactionType: string; // Enum string value (InteractionType)
  previousInteractionId?: number;
  planningDate?: string; // ISO 8601 Date String
  interactionDate?: Date; // ISO 8601 Date String
  joinFilePath?: string;
  address?: string;
  agentId?: number;
  affectedToId?: number;
}
