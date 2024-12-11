import {UserDto} from './usersResponseDto';

export class TrackingLogResponseDto  {
  id: number;
  actionType: string;
  timestamp: string; // ISO string
  user: UserDto;
  details: string;

  constructor(data?:any) {
    this.id = data.id;
    this.actionType = data.actionType;
    this.timestamp = data.timestamp;
    this.user = data.user;
    this.details = data.details;
  }
}
