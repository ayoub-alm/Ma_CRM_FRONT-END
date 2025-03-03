export class InterlocutorsFilterRequestDto {
  status: string[];
  customersIds:number[];
  departmentsIds:number[];
  jobTitlesIds:number[];
  createdByIds:number[];
  updatedByIds:number[];
  companyId: number;
  filterType: string;
  createdAtStart: Date | null;
  createdAtEnd: Date | null;
  updatedAtStart: Date | null;
  updatedAtEnd:Date | null;

  /**
   * Constructs an instance of the filter configuration with the provided parameters.
   *
   * @param {string[]} status - Array of status values to filter on.
   * @param {number[]} customersIds - List of customer IDs for filtering.
   * @param {number[]} departmentsIds - List of department IDs for filtering.
   * @param {number[]} jobTitlesIds - List of job title IDs for filtering.
   * @param {number[]} createdByIds - List of creator IDs for filtering.
   * @param {number[]} updatedByIds - List of updater IDs for filtering.
   * @param {string} filterType - Type of the filter to be applied.
   * @param {number} companyId - ID of the company for filtering.
   * @param {Date | null} createdAtStart - Start date for creation date range filtering.
   * @param {Date | null} createdAtEnd - End date for creation date range filtering.
   * @param {Date | null} updatedAtStart - Start date for update date range filtering.
   * @param {Date | null} updatedAtEnd - End date for update date range filtering.
   * @return {void}
   */
  constructor(status: string[], customersIds:number[], departmentsIds:number[], jobTitlesIds:number[], createdByIds:number[],
            updatedByIds:number[], filterType: string, companyId: number,createdAtStart: Date | null, createdAtEnd: Date | null,
            updatedAtStart: Date | null, updatedAtEnd: Date | null) {
  this.status = status || [];
  this.customersIds = customersIds || [];
  this.departmentsIds = departmentsIds || [];
  this.jobTitlesIds = jobTitlesIds || [];
  this.createdByIds = createdByIds || [];
  this.companyId = companyId;
  this.filterType = filterType;
  this.createdAtStart = createdAtStart;
  this.createdAtEnd = createdAtEnd;
  this.updatedAtStart = updatedAtStart;
  this.updatedAtEnd = updatedAtEnd;
  this.updatedByIds = updatedByIds || [];
}
}
