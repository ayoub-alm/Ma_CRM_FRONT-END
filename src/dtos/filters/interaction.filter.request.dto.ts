export class InteractionFilterDto {
  companyId: number;
  customerIds: number[];
  interlocutorIds: number[];
  createdByIds: number[];
  affectedToIds: number[];
  interactionTypes: string[];
  interactionSubjects: string[];
  filterType: "AND" | "OR";
  createdAtStart: Date | null;
  createdAtEnd: Date | null;
  updatedAtStart: Date | null;
  updatedAtEnd:Date | null;

  /**
   * Constructor for creating a new instance with specific filters and parameters.
   *
   * @param {number} companyId - The ID of the company associated with the instance.
   * @param {number[]} customerIds - An array of customer IDs involved in the interaction.
   * @param {number[]} interlocutorIds - An array of interlocutor IDs associated with the interaction.
   * @param {number[]} createdByIds - An array of creator IDs who initiated the interaction.
   * @param {number[]} affectedToIds - An array of IDs representing users affected by the interaction.
   * @param {string[]} interactionTypes - An array of interaction types for filtering the data.
   * @param {string[]} interactionSubjects - An array of subjects related to the interaction.
   * @param {string} startDate - The start date of the interaction in a string format.
   * @param {string} endDate - The end date of the interaction in a string format.
   * @param {"AND" | "OR"} filterType - The logical filter type to apply (AND/OR) between filters.
   * @param {Date | null} createdAtStart - The start date filter for record creation (nullable).
   * @param {Date | null} createdAtEnd - The end date filter for record creation (nullable).
   * @param {Date | null} updatedAtStart - The start date filter for record update (nullable).
   * @param {Date | null} updatedAtEnd - The end date filter for record update (nullable).
   * @return {void} This constructor does not return a value.
   */
  constructor(
    companyId: number,
  customerIds: number[],
  interlocutorIds: number[],
  createdByIds: number[],
  affectedToIds: number[],
  interactionTypes: string[],
  interactionSubjects: string[],
  filterType: "AND" | "OR",
  createdAtStart: Date | null,
  createdAtEnd: Date | null,
  updatedAtStart: Date | null,
  updatedAtEnd:Date | null,
  ) {
    this.companyId = companyId;
    this.customerIds = customerIds;
    this.interlocutorIds = interlocutorIds;
    this.createdByIds = createdByIds;
    this.affectedToIds = affectedToIds;
    this.interactionTypes = interactionTypes;
    this.interactionSubjects = interactionSubjects;
    this.filterType = filterType;
    this.createdAtStart = createdAtStart;
    this.createdAtEnd = createdAtEnd;
    this.updatedAtStart = updatedAtStart;
    this.updatedAtEnd = updatedAtEnd;
  }
}
