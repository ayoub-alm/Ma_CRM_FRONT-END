export class UserModel {
  id: number ;
  name: string;
  matriculate: string;
  password : string;
  role :string;

  constructor(id: number , username: string, matriculate: string, password: string, role: string) {
    this.id = id;
    this.name = username;
    this.matriculate = matriculate;
    this.password = password;
    this.role = role;
  }
}
