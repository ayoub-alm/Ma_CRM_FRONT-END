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
  volume: number; // Optional field, must be >= 0
  quantity: number;
  uvc?: number;
  uc?: number;
  isFragile?:number
  provisions: ProvisionResponseDto[]; // List of provisions

  constructor(data: any) {
    this.supportId = data.supportId;
    this.structureId = data.structureId;
    this.temperatureId = data.temperatureId;
    this.width = data.width;
    this.height = data.height;
    this.weight = data.weight;
    this.length = data.length;
    this.stackedLevel = data.stackedLevel;
    this.volume = data.volume;
    this.uvc = data.uvc;
    this.uc = data.uc;
    this.provisions = data.provisions;
    this.isFragile = data.isFragile;
    this.quantity = data.quantity;
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
    weight: response.weight ? response.weight : 0,
    stackedLevel: response.stackedLevelName && !isNaN(Number(response.stackedLevelName)) ? Number(response.stackedLevelName) : 0,
    volume: response.volume ? response.volume : 0,
    Uvc: response.uvc ?? 0,
    Uc: response.uc ?? 0,
    isFragile:response.isFragile ? 1 : 0,
    provisions: response.provisionResponseDto ?? [],
    quantity: response.quantity ?? 0,
  });
}
