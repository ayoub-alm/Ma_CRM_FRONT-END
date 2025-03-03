import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {BehaviorSubject, tap} from 'rxjs';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../../services/local.storage.service';
import {CompanySizeService} from '../../../../services/data/company.size.service';
import {JobTitleService} from '../../../../services/data/job.title.service';
import {ProprietaryStructureService} from '../../../../services/data/proprietary.structure.service';
import {CityService} from '../../../../services/data/city.service';
import {CountryService} from '../../../../services/data/country.service';
import {IndustryService} from '../../../../services/data/industry.service';
import {UsersService} from '../../../../services/users.service';
import {CourtService} from '../../../../services/data/court.service';
import {LegalStatusService} from '../../../../services/data/legal.status.service.dto';
import {CompanySizeResponseDto} from '../../../../dtos/init_data/response/company.size.response.dt';
import {JobTitleResponseDto} from '../../../../dtos/init_data/response/job.title.response.dto';
import {ProprietaryStructureDto} from '../../../../dtos/init_data/response/proprietary.structure.dto';
import {CityResponseDto} from '../../../../dtos/init_data/response/city.response.dt';
import {CountryResponseDto} from '../../../../dtos/init_data/response/country.response.dto';
import {IndustryResponseDto} from '../../../../dtos/init_data/response/industry.response.dt';
import {CourtResponseDto} from '../../../../dtos/init_data/response/court.response.dto';
import {LegalStatusDto} from '../../../../dtos/init_data/response/legal.status.dto';
import {UserDto} from '../../../../dtos/response/usersResponseDto';
import {AsyncPipe, KeyValuePipe, NgForOf} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {PaginatorModule} from 'primeng/paginator';
import {ProspectStatus} from '../../../../enums/prospect.status';
import {BulkCustomerEditRequestDto} from '../../../../dtos/request/leads/bluk.edit.customers.dto';
import {ProspectService} from '../../../../services/Leads/prospect.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerStatus, CustomerStatusService} from '../../../../services/Leads/customer.status.service';

@Component({
  selector: 'app-customer-bulk-edit',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    KeyValuePipe,
    MatFormField,
    MatIcon,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    PaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './customer-bulk-edit.component.html',
  styleUrl: './customer-bulk-edit.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerBulkEditComponent implements OnInit{
  count:BehaviorSubject<string> = new BehaviorSubject("");
  fieldFilterForm!: FormGroup;
  companySizes: BehaviorSubject<CompanySizeResponseDto[]> = new BehaviorSubject<CompanySizeResponseDto[]>([]);
  jobTitles: BehaviorSubject<JobTitleResponseDto[]> = new BehaviorSubject<JobTitleResponseDto[]>([]);
  proprietaryStructures: BehaviorSubject<ProprietaryStructureDto[]> = new BehaviorSubject<ProprietaryStructureDto[]>([]);
  cities: BehaviorSubject<CityResponseDto[]> = new BehaviorSubject<CityResponseDto[]>([]);
  countries: BehaviorSubject<CountryResponseDto[]> = new BehaviorSubject<CountryResponseDto[]>([]);
  industries: BehaviorSubject<IndustryResponseDto[]> = new BehaviorSubject<IndustryResponseDto[]>([]);
  courts: BehaviorSubject<CourtResponseDto[]> = new BehaviorSubject<CourtResponseDto[]>([]);
  legalStatuses: BehaviorSubject<LegalStatusDto[]> = new BehaviorSubject<LegalStatusDto[]>([]);
  users: BehaviorSubject<UserDto[]> = new BehaviorSubject<UserDto[]>([])
  customersStatus: BehaviorSubject<CustomerStatus[]> = new BehaviorSubject<CustomerStatus[]>([])
  constructor(
    public dialogRef: MatDialogRef<CustomerBulkEditComponent>, // ✅ Correct type
    @Inject(MAT_DIALOG_DATA) public data: Set<number>, // ✅ Correct injection
    protected router: Router,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private companySizesService: CompanySizeService,
    private jobTitleService: JobTitleService,
    private proprietaryStructureService: ProprietaryStructureService,
    private cityService: CityService,
    private countryService: CountryService,
    private industryService: IndustryService,
    private userService: UsersService,
    private courtService: CourtService,
    private legalStatusService: LegalStatusService,
    private customerService: ProspectService,
    private snackBar: MatSnackBar,
    private customerStatusService: CustomerStatusService
  )  {
    this.fieldFilterForm = fb.group({
      statusIds:[""],
      industryId:[""],
      cityId:[""],
      countryId:[""],
      companySizeId:[""],
      structureId:[""],
      legalStatusId:[""],
      affectedToId:[""]
    })
  }

  ngOnInit(): void {
    this.loadData()
  }

  /**
   * load data to fill selected box's
   */
  loadData(){
    this.customerStatusService.getAllActiveStatuses().subscribe(status => {this.customersStatus.next(status)})
    this.companySizesService.getAllCompaniesSizes().subscribe(sizes => this.companySizes.next(sizes));
    this.jobTitleService.getAllJobTitles().subscribe(jobTitles => this.jobTitles.next(jobTitles));
    this.proprietaryStructureService.getAllProprietaryStructure().subscribe(proprietaryStructures => this.proprietaryStructures.next(proprietaryStructures));
    this.cityService.getAllCities().subscribe(cities => this.cities.next(cities));
    this.countryService.getAllCountries().subscribe(countries => this.countries.next(countries));
    this.industryService.getAllIndustries().subscribe(industries => this.industries.next(industries));
    this.courtService.getAllCourt().subscribe(courts => this.courts.next(courts));
    this.legalStatusService.getAllLegalStatus().subscribe(legalStatuses => this.legalStatuses.next(legalStatuses));
    this.userService.getAllUsers().pipe(tap(users => this.users.next(users))).subscribe()
  }

  /**
   * Submits the bulk edit request
   */
  submitBulkEdit() {
    if (this.data.size === 0) {
      this.snackBar.open("No customers selected!", "Close", { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }

    const request: BulkCustomerEditRequestDto = {
      customerIds: Array.from(this.data),
      statusId: this.fieldFilterForm.value.statusIds,
      industryId: this.fieldFilterForm.value.industryId,
      cityId: this.fieldFilterForm.value.cityId,
      countryId: this.fieldFilterForm.value.countryId,
      companySizeId: this.fieldFilterForm.value.companySizeId,
      structureId: this.fieldFilterForm.value.structureId,
      legalStatusId: this.fieldFilterForm.value.legalStatusId,
      affectedToId: this.fieldFilterForm.value.affectedToId
    };

    this.customerService.bulkEditCustomers(request).subscribe({
      next: () => {
        this.snackBar.open("Bulk update successful!", "Close", { duration: 3000, panelClass: ['success-snackbar'] });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error("Bulk update failed:", err);
        this.snackBar.open("Bulk update failed!", "Close", { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  protected readonly ProspectStatus = ProspectStatus;
}
