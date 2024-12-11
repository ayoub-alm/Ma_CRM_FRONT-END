import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DepartmentModel} from "../../models/department.model";

@Injectable({
  providedIn: 'root'
})

export class DepartmentService {
  private readonly baseUrl: string = 'http://localhost:8080';
  constructor(private http: HttpClient) {
  }


  getAllDepartment(): Observable<DepartmentModel[]>{
    return this.http.get<DepartmentModel[]>(`${this.baseUrl}/api/departments`).pipe();
  }
}
