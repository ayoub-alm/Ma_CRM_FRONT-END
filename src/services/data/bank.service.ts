import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {BankModel} from "../../models/bank.model";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class BankService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  /**
   * this function allows us to get all banks
   */
  getAllBanks(): Observable<BankModel[]>{
    return this.http.get<BankModel[]>(`${this.baseUrl}/banks`).pipe(
      tap(banks =>{
        banks.map((bank: BankModel) => {
          return new BankModel(bank.id,bank.createdAt,bank.updatedAt,bank.createdBy,bank.name,bank.active,bank.deletedAt)
        })
      })
    )
  }

  /**
   * This function allows us to create new bank
   * @param bank
   */
  createBank(bank: BankModel): Observable<BankModel> {
    return this.http.post<BankModel>(`${this.baseUrl}/banks`, bank, ).pipe(
      tap(bank => {
         new BankModel(bank.id,bank.createdAt,bank.updatedAt,bank.createdBy,bank.name,bank.active,bank.deletedAt)
      })
    )
  }

  deleteBank(bank: BankModel): Observable<BankModel> {
    return this.http.delete<BankModel>(`${this.baseUrl}/banks/${bank.id}`)
  }
}
