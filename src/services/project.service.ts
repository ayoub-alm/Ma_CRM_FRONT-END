import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {CreateProjectRequestDto} from "../dtos/request/CreateProjectRequestDto";
import {ProjectDto} from "../dtos/response/ProjectDto";
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  /**
   * this function allows to create project with name and company ID
   * @param project the project to save
   * @retrun { ProjectDto } the created project
   */
  createProject(project: CreateProjectRequestDto):Observable<ProjectDto> {
    return  this.http.post<ProjectDto>(`${this.baseUrl}/api/projects`, project).pipe(
      tap(project => new ProjectDto(project.createdAt,project.updatedAt,project.deletedAt,project.createdBy,
        project.id,project.name,project.active))
    )
  }

  getProjectsByCompanyId(companyId:number):Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.baseUrl}/api/projects/company/${companyId}`).pipe(
      tap(projects => {
        projects.map(project => {
          new ProjectDto(project.createdAt,project.updatedAt,project.deletedAt,project.createdBy,
            project.id,project.name,project.active)
        })
      })
    )
  }
}
