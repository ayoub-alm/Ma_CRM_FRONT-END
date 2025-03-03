export interface BulkCustomerEditRequestDto {
  customerIds: number[];  // List of customer IDs
  statusId?: string; // Optional: new status
  industryId?: number;
  cityId?: number;
  countryId?: number;
  companySizeId?: number;
  structureId?: number;
  legalStatusId?: number;
  affectedToId?: number;
}
