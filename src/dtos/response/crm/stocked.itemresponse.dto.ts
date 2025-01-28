export class StockedItemResponseDto {
  id: number; // The ID of the stocked item
  ref: string; // UUID of the stocked item
  supportName: string | null; // Name of the support
  structureName: string | null; // Name of the structure
  stackedLevelName: string | null; // Name or level of stacking
  temperatureName: string | null; // Name of the temperature type
  isFragile: boolean; // Indicates if the item is fragile
  uvc: number | null; // Unit volume count
  numberOfPackages: number | null; // Total number of packages
  dimension: Dimension | null; // Dimension object
  price: number | null; // Price of the stocked item
  storageOffer: StorageOffer | null; // Associated storage offer
  storageNeed: StorageNeed | null; // Associated storage need
  provisionResponseDto: ProvisionResponseDto | null; // Provision response details

  constructor(data:any) {
    this.id = data.id;
    this.ref = data.ref;
    this.supportName = data.supportName;
    this.structureName = data.supportStructureName;
    this.stackedLevelName = data.supportStackedLevelName;
    this.temperatureName = data.supportTemperatureName;
    this.isFragile = data.supportIsFragile;
    this.uvc = data.uvc;
    this.numberOfPackages = data.numberOfPackages;
    this.dimension = data.dimension;
    this.price = data.price;
    this.storageOffer = data.storageOffer;
    this.storageNeed = data.storageNeed;
    this.provisionResponseDto = data.provisionResponseDto;
  }
}

export class Dimension {
  id: number;
  length: number;
  width: number;
  height: number;
  constructor(data:any) {
    this.id = data.id;
    this.height = data.height;
    this.width = data.width;
    this.length = data.lenght;
  }
}

export class StorageOffer {
  id: number;
  offerName: string;
  offerDetails: string;

  constructor(data:any) {
    this.id = data.id;
    this.offerName = data.offerName;
    this.offerDetails = data.offerDetails;
  }
}

export class StorageNeed {
  id: number;
  needName: string;
  needDetails: string;
  constructor(data:any) {
    this.id = data.id;
    this.needName = data.needName;
    this.needDetails = data.needDetails;
  }
}

export class ProvisionResponseDto {
  id: number;
  provisionType: string;
  provisionQuantity: number;
  constructor(data: any) {
    this.id = data.id;
    this.provisionType = data.provisionType;
    this.provisionQuantity = data.provisionQuantity;
  }
}
