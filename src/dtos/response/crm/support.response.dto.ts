import {Dimension} from './stocked.itemresponse.dto';
import {DimensionsDTO} from '../dimensions.dto';

export class SupportResponseDto {
  id: number;
  name: string;
   ref: string;
   dimension:DimensionsDTO;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.ref = data.ref;
    this.dimension = data.constructor;
  }
}
