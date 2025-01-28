import {ProvisionResponseDto} from '../../response/crm/provision.response.dto';

export class StockedItemCreateDto{
  supportId: number; // Required field
  structureId: number; // Optional field
  temperatureId: string; // Required field
  larger: number; // Optional field, must be >= 0
  length: number; // Optional field, must be >= 0
  height: number; // Optional field, must be >= 0
  weight: number; // Optional field, must be >= 0
  stackedLevel: number; // Required field, must be >= 0
  volumeStock?: number; // Optional field, must be >= 0
  numberUvc?: number;
  numberUc?: number;
  provisions: ProvisionResponseDto[]; // List of provisions

  constructor(data: any) {
    this.supportId = data.supportId;
    this.structureId = data.structureId;
    this.temperatureId = data.temperatureId;
    this.larger = data.largeur;
    this.height = data.height;
    this.weight = data.poids;
    this.length = data.length;
    this.stackedLevel = data.stackedLevel;
    this.volumeStock = data.volumeStock;
    this.numberUvc = data.nombreUvc;
    this.numberUc = data.numberUc;
    this.provisions = data.provisions;
  }
}
