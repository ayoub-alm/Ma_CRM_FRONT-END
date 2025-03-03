export class UserDto {
  name: string ;      // Name can be null
  email: string;            // Email is a required string
  aboutMe: string | null;   // AboutMe is a string and optional
  phone: string;            // Phone is required
  id: number;               // ID is required
  role: string | null;      // Role can be null
  rights: any[];

constructor(data: any) {
  this.name = data.name;
  this.email = data.email;
  this.aboutMe = data.aboutMe;
  this.phone = data.phone;
  this.id = data.id;
  this.role = data.role;
  this.rights = data.rights;
}
}
