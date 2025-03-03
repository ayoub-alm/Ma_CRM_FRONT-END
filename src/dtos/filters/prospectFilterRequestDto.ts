import {ProspectStatus} from '../../enums/prospect.status';

export class ProspectFilterRequestDto {
  status: string[];
  industryIds: number[];
  cityIds: number[];
  countryIds: number[];
  companySizeIds: number[];
  structureIds: number[];
  legalStatusIds: number[];
  createdByIds: number[];
  updatedByIds: number[];
  companyId: number;
  filterType: string;
  createdAtStart: Date | null;
  createdAtEnd: Date | null;
  updatedAtStart: Date | null;
  updatedAtEnd:Date | null;
  affectedToIds: number[];

  /**
   * Constructs a new instance with the given parameters for filtering and categorization.
   *
   * @param {string[]} status - Array of status values to filter by.
   * @param {number[]} industryIds - Array of industry IDs to filter by.
   * @param {number[]} cityIds - Array of city IDs to filter by.
   * @param {number[]} countryIds - Array of country IDs to filter by.
   * @param {number[]} companySizeIds - Array of company size IDs to filter by.
   * @param {number[]} structureIds - Array of structure IDs to filter by.
   * @param {number[]} legalStatusIds - Array of legal status IDs to filter by.
   * @param {number[]} createdByIds - Array of IDs of users who created relevant records.
   * @param {number[]} updatedByIds - Array of IDs of users who updated relevant records.
   * @param {number} companyId - ID of the company to filter by.
   * @param {string} filterType - The type of filter being applied.
   * @param {Date} createdAtStart - Start date for filtering by creation time.
   * @param {Date} createdAtEnd - End date for filtering by creation time.
   * @param {Date} updatedAtStart - Start date for filtering by update time.
   * @param {Date} updatedAtEnd - End date for filtering by update time.
   * @param {number[]} affectedToIds - Array of IDs of users who affected to relevant records.
   * @return {void} Does not return a value.
   */
  constructor(
    status: string[], industryIds: number[], cityIds: number[], countryIds: number[], companySizeIds: number[],
    structureIds: number[], legalStatusIds: number[], createdByIds: number[],  updatedByIds: number[], companyId: number, filterType: string,
    createdAtStart: Date ,createdAtEnd: Date , updatedAtStart: Date, updatedAtEnd: Date,   affectedToIds: number[]
) {
    this.status = status || [];
    this.industryIds = industryIds || [];
    this.cityIds = cityIds || [];
    this.countryIds = countryIds || [];
    this.companySizeIds = companySizeIds || [];
    this.structureIds = structureIds || [];
    this.legalStatusIds = legalStatusIds || [];
    this.createdByIds = createdByIds || [];
    this.updatedByIds = updatedByIds || [];
    this.companyId = companyId;
    this.filterType = filterType;
    this.createdAtStart = createdAtStart;
    this.createdAtEnd = createdAtEnd;
    this.updatedAtStart = updatedAtStart;
    this.updatedAtEnd = updatedAtEnd;
    this.affectedToIds = affectedToIds
  }
}
