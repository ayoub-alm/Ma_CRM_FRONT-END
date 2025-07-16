import {StorageDeliveryNoteResponseDto} from './storage.delivery.note.response.dto';
import {UserResponseDto} from '../../../app/dtos/response/super-admin-responseDtos/user.response.dto';

export class StorageDeliveryNoteUpdateRequestDto {
  id: number;
  note:string;
  status: number;
  StorageDeliveryNote: StorageDeliveryNoteResponseDto;
  createdAt:string;
  createdBy:UserResponseDto;
  updatedBy:UserResponseDto;

  constructor(data: any) {
    this.id = data.id;
    this.note = data.note;
    this.status = data.status;
    this.StorageDeliveryNote = data.storageDeliveryNoteResponseDto;
    this.createdAt = data.createdAt;
    this.updatedBy = data.updatedBy;
    this.createdBy = data.createdBy;
  }
}
