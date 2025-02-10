import {ProvisionResponseDto} from '../../response/crm/provision.response.dto';
import {StockedItemResponseDto} from '../../response/crm/stocked.itemresponse.dto';

export class StockedItemCreateDto{
  supportId: number; // Required field
  structureId: number; // Optional field
  temperatureId: string; // Required field
  width: number; // Optional field, must be >= 0
  length: number; // Optional field, must be >= 0
  height: number; // Optional field, must be >= 0
  weight: number; // Optional field, must be >= 0
  stackedLevel: number; // Required field, must be >= 0
  volume?: number; // Optional field, must be >= 0
  numberUvc?: number;
  numberUc?: number;
  isFragile?:number
  provisions: ProvisionResponseDto[]; // List of provisions

  constructor(data: any) {
    this.supportId = data.supportId;
    this.structureId = data.structureId;
    this.temperatureId = data.temperatureId;
    this.width = data.width;
    this.height = data.height;
    this.weight = data.poids;
    this.length = data.length;
    this.stackedLevel = data.stackedLevel;
    this.volume = data.volume;
    this.numberUvc = data.nombreUvc;
    this.numberUc = data.numberUc;
    this.provisions = data.provisions;
    this.isFragile = data.isFragile;
  }
}


export function mapStockedItemResponseToCreate(response: StockedItemResponseDto): StockedItemCreateDto {
  if (!response) {
    throw new Error("Invalid response: StockedItemResponseDto is required.");
  }

  return new StockedItemCreateDto({
    supportId:  1,
    structureId: 1,
    temperatureId: 1,
    width: response.dimension?.width ?? 0,
    length: response.dimension?.length ?? 0,
    height: response.dimension?.height ?? 0,
    weight: response.isFragile ? 1 : 0,
    stackedLevel: response.stackedLevelName && !isNaN(Number(response.stackedLevelName)) ? Number(response.stackedLevelName) : 0,
    volumeStock: response.dimension ? (response.dimension.length * response.dimension.width * response.dimension.height) : 0,
    numberUvc: response.uvc ?? 0,
    numberUc: response.numberOfPackages ?? 0,
    isFragile:response.isFragile ? 1 : 0,
    provisions: response.provisionResponseDto ?? [],
  });
}
