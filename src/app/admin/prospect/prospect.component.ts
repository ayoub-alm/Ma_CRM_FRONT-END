import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter, MatNativeDateModule } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CheckboxModule} from 'primeng/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {AddProspectDialogComponent} from './add-prospect-dialog/add-prospect-dialog.component';
import {
  BehaviorSubject,
  catchError, concatMap,
  debounce,
  debounceTime,
  EMPTY,
  filter, flatMap,
  Observable,
  of,
  switchMap,
  take,
  tap
} from 'rxjs';
import {ProspectResponseDto} from '../../../dtos/response/prospect.response.dto';
import {ProspectService} from '../../../services/Leads/prospect.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {Router, RouterLink} from '@angular/router';
import {DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {
  getAllCustomerStatus,
  getAllCustomerStatusLabel,
  getLabelFromStatus,
  ProspectStatus
} from '../../../enums/prospect.status';
import {MatTabLink, MatTabNav, MatTabNavPanel} from '@angular/material/tabs';
import {ConfirmationDialogComponent} from "../../utils/confirmation-dialog/confirmation-dialog.component";
import {LocalStorageService} from '../../../services/local.storage.service';
import {DisplayColumnsInterface, FilterOption} from '../../utils/spider.table';
import {MultiSelectModule} from 'primeng/multiselect';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CompanySizeResponseDto} from '../../../dtos/init_data/response/company.size.response.dt';
import {JobTitleResponseDto} from '../../../dtos/init_data/response/job.title.response.dto';
import {ProprietaryStructureDto} from '../../../dtos/init_data/response/proprietary.structure.dto';
import {CityResponseDto} from '../../../dtos/init_data/response/city.response.dt';
import {CountryResponseDto} from '../../../dtos/init_data/response/country.response.dto';
import {IndustryResponseDto} from '../../../dtos/init_data/response/industry.response.dt';
import {CourtResponseDto} from '../../../dtos/init_data/response/court.response.dto';
import {LegalStatusDto} from '../../../dtos/init_data/response/legal.status.dto';
import {CompanySizeService} from '../../../services/data/company.size.service';
import {JobTitleService} from '../../../services/data/job.title.service';
import {ProprietaryStructureService} from '../../../services/data/proprietary.structure.service';
import {CityService} from '../../../services/data/city.service';
import {CountryService} from '../../../services/data/country.service';
import {IndustryService} from '../../../services/data/industry.service';
import {CourtService} from '../../../services/data/court.service';
import {LegalStatusService} from '../../../services/data/legal.status.service.dto';
import {UserDto} from '../../../dtos/response/usersResponseDto';
import {UsersService} from '../../../services/users.service';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {ProspectFilterRequestDto} from '../../../dtos/filters/prospectFilterRequestDto';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, NativeDateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {CustomerBulkEditComponent} from './customer-bulk-edit/customer-bulk-edit.component';
import {CustomerStatus, CustomerStatusService} from '../../../services/Leads/customer.status.service';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
  selector: 'app-prospect',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatCheckboxModule, CheckboxModule, MatMenu, MatMenuTrigger, MatMenuItem, NgIf, NgClass,
    MatTabNavPanel, NgForOf, MultiSelectModule, ReactiveFormsModule, DatePipe, MatSelect, MatOption,
    MatRadioButton, MatRadioGroup, MatDateRangeInput, MatDatepickerToggle, MatDateRangePicker,MatDatepickerModule],
  templateUrl: './prospect.component.html',
  styleUrls: ['./prospect.component.css'],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProspectComponent implements OnInit, AfterViewInit {
  allTableColumns: BehaviorSubject<DisplayColumnsInterface[]> = new BehaviorSubject<DisplayColumnsInterface[]>([
    { order: 0, title: 'select', label: 'Sélectionner' },
    { order: 1, title: 'name', label: 'Nom' },
    { order: 1, title: 'sigle', label: 'Sigle' },
    { order: 2, title: 'status', label: 'Statut' },
    { order: 3, title: 'industry', label: 'Industrie' },
    { order: 4, title: 'city', label: 'Ville' },
    { order: 5, title: 'email', label: 'E-mail' },
    { order: 6, title: 'phone', label: 'Téléphone' },
    { order: 7, title: 'description', label: 'Description' },
    { order: 8, title: 'capital', label: 'Capital' },
    { order: 9, title: 'country', label: 'Pays' },
    { order: 10, title: 'companySize', label: 'Taille de l\'entreprise' },
    { order: 11, title: 'headOffice', label: 'Siège social' },
    { order: 12, title: 'yearOfCreation', label: 'Année de création' },
    { order: 13, title: 'ice', label: 'ICE' },
    { order: 14, title: 'rc', label: 'RC' },
    { order: 15, title: 'ifm', label: 'IFM' },
    { order: 16, title: 'patent', label: 'Patent' },
    { order: 17, title: 'cnss', label: 'CNSS' },
    { order: 18, title: 'court', label: 'Tribunal' },
    { order: 19, title: 'createdAt', label: 'Créé le' },
    { order: 20, title: 'updatedAt', label: 'Mis à jour le' },
    { order: 21, title: 'createdBy', label: 'Créé par' },
    { order: 23, title: 'updatedBy', label: 'Mis à jour par' },
    { order: 24, title: 'fix', label: 'Fixe' },
    { order: 25, title: 'whatsapp', label: 'WhatsApp' },
    { order: 26, title: 'linkedin', label: 'LinkedIn' },
    { order: 27, title: 'website', label: 'Site Web' },
    { order: 28, title: 'actions', label: 'Actions' }
  ]);

  displayedColumns: BehaviorSubject<DisplayColumnsInterface[]> = new BehaviorSubject<DisplayColumnsInterface[]>([
    { order: 0, title: 'select', label: 'Sélectionner' },
    { order: 1, title: 'name', label: 'Nom' },
    { order: 2, title: 'status', label: 'Statut' },
    { order: 3, title: 'industry', label: 'Industrie' },
    { order: 4, title: 'city', label: 'Ville' },
    { order: 5, title: 'email', label: 'E-mail' },
    { order: 28, title: 'actions', label: 'Actions' }
  ]);
  companySizes: BehaviorSubject<CompanySizeResponseDto[]> = new BehaviorSubject<CompanySizeResponseDto[]>([]);
  jobTitles: BehaviorSubject<JobTitleResponseDto[]> = new BehaviorSubject<JobTitleResponseDto[]>([]);
  proprietaryStructures: BehaviorSubject<ProprietaryStructureDto[]> = new BehaviorSubject<ProprietaryStructureDto[]>([]);
  cities: BehaviorSubject<CityResponseDto[]> = new BehaviorSubject<CityResponseDto[]>([]);
  countries: BehaviorSubject<CountryResponseDto[]> = new BehaviorSubject<CountryResponseDto[]>([]);
  industries: BehaviorSubject<IndustryResponseDto[]> = new BehaviorSubject<IndustryResponseDto[]>([]);
  courts: BehaviorSubject<CourtResponseDto[]> = new BehaviorSubject<CourtResponseDto[]>([]);
  legalStatuses: BehaviorSubject<LegalStatusDto[]> = new BehaviorSubject<LegalStatusDto[]>([]);
  users: BehaviorSubject<UserDto[]> = new BehaviorSubject<UserDto[]>([]);
  customerStatus:BehaviorSubject<CustomerStatus[]> = new BehaviorSubject<CustomerStatus[]>([])
  dropdownOpen = false;
  dataSource: MatTableDataSource<ProspectResponseDto> = new MatTableDataSource(); // Initialized safely
  prospects: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  selectedFile: File | null = null; // file xls\csv to upload
  isShowImportZone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  links: string[] = [];
  activeLink: BehaviorSubject<string> = new BehaviorSubject<string>("");
  // Mapping icons to ProspectStatus values
  statusIcons: Record<string, string> = {
    [ProspectStatus.NEW]: 'fiber_new',
    [ProspectStatus.QUALIFIED]: 'thumb_up',
    [ProspectStatus.INTERESTED]: 'star',
    [ProspectStatus.OPPORTUNITY]: 'lightbulb',
    [ProspectStatus.CONVERTED]: 'done_all',
    [ProspectStatus.DISQUALIFIED]: 'remove_circle',
    [ProspectStatus.LOST]: 'cancel',
    [ProspectStatus.NRP]: 'phone_missed'
  };
  protected readonly ProspectStatus = ProspectStatus;
  searchForm!: FormGroup;
  fieldFilterForm!: FormGroup;
  isFiltersVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private dialog: MatDialog, private prospectService: ProspectService, private snackBar: MatSnackBar,
              protected router: Router, private localStorageService: LocalStorageService, private fb: FormBuilder,
              private companySizesService: CompanySizeService, private jobTitleService: JobTitleService,
              private proprietaryStructureService: ProprietaryStructureService, private cityService: CityService,
              private countryService: CountryService, private industryService: IndustryService,private userService: UsersService,
              private courtService: CourtService, private legalStatusService: LegalStatusService, private customerStatusService: CustomerStatusService) {
    this.links = getAllCustomerStatusLabel(); // Populate with ProspectStatus labels
    if (this.links.length > 0) {
      this.activeLink.next("");
    }
    // init search filed form group
    this.searchForm = fb.group({
      search:[""]
    })
    // init fields form
    this.fieldFilterForm = fb.group({
      filterType:["OR"],
      statusIds:[""],
      industryIds:[""],
      cityIds:[""],
      countryIds:[""],
      companySizeIds:[""],
      structureIds:[""],
      legalStatusIds:[""],
      createdByIds:[""],
      updatedByIds:[""],
      affectedToIds:[""],
      createdAtStart: [null],  // Date de début de création
      createdAtEnd: [null],    // Date de fin de création
      updatedAtStart: [null],  // Date de début de mise à jour
      updatedAtEnd: [null]
    })
  }



  ngOnInit(): void {
    this.loadCustomers();
    this.listenSearchForm();
    this.loadFiltersData();
  }

  /**
   * fetch customers
   */
  loadCustomers():ProspectResponseDto[]  {
    this.prospectService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).subscribe({
      next: (data: ProspectResponseDto[]) => {
        this.prospects.next(data);
        this.dataSource.data = data;
        this.paginator.firstPage();
        return data;
      }, error: (err) => {
        console.error('Error fetching prospects:', err);
      },
    });
    return this.prospects.getValue();
  }



  /**
   * This
   */
  listenSearchForm(){
    this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(3000),
      tap(value => {this.applyFilter(value)})
    ).subscribe()
  }


  ngAfterViewInit(): void {
    // Bind paginator and sort after view initialization
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * This function allows to filter data in table
   * @param event
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.prospectService.getCustomerBySearchValueAndCompanyId(filterValue, this.localStorageService.getCurrentCompanyId()).pipe(tap(data => {
      this.prospects.next(data)
      this.dataSource.data = data;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }), catchError(err => {
      this.prospects.next([])
      this.snackBar.open("Aucun prospect correspondant à votre recherche", "OK", {duration: 3000});
      return of(null)
    })).subscribe()
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * This function allows to open dialog to add new prospect
   */
  openAddProspectDialog(): void {
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      maxWidth: '900px', maxHeight: '100vh'
    });

    dialogRef.afterClosed().pipe(tap(response => {
      if (response) {
        // Check if the item already exists in the data source based on the ID
        const existingItemIndex = this.dataSource.data.findIndex(item => item.id === response.id);
        console.log("message ", existingItemIndex)
        if (existingItemIndex > -1) {
          // If the item exists, update it
          const updatedData = [...this.dataSource.data];
          updatedData[existingItemIndex] = response;
          this.dataSource.data = updatedData; // Trigger Angular's Change Detection
        } else {
          // If it doesn't exist, add the new item to the data
          this.dataSource.data = [...this.dataSource.data, response]; // Add new item and trigger Change Detection
        }
        // Reset paginator to the first page
        if (this.paginator) {
          this.paginator.firstPage();
        }
      }
    })).subscribe();

  }

  /**
   * This function allows to edit prospect
   * @param row
   */
  editProspect(row: any): void {
    // Open dialog for editing the prospect
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      maxWidth: '900px', data: {...row}  // Pass the prospect data to the dialog for editing
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result, update the prospect if necessary
        const index = this.dataSource.data.findIndex(p => p.id === row.id);
        if (index !== -1) {
          this.dataSource.data[index] = result;
        }
      }
    });
  }

  /**
   * This function show import zone
   * @param row
   */
  showProspectDetails(row: ProspectResponseDto) {
    this.router.navigateByUrl(`admin/prospects/${row.id}`)
  }

  /**
   * Handle drag over event to change style
   * @param event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Change the style to indicate that the file can be dropped
    // event.target?.classList.add('drag-over');
  }

  /**
   * Handle drag leave event to revert style
   * @param event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Revert the style
    // event.target?.classList.remove('drag-over');
  }

  /**
   * Handle drop event to capture the file
   * @param event
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0]; // Take the first file
    }
  }

  /**
   * Handle file selection through input
   * @param event the selected File
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  /**
   * Upload file  and send it to back-end
   */
  uploadFile(): void {
    if (this.selectedFile) {
      this.prospectService.uploadFile(this.selectedFile, this.localStorageService.getCurrentCompanyId()).pipe(
        tap(data => {
          this.dataSource.data = [...this.dataSource.data, ...data];
          this.paginator.firstPage();
        }),
        catchError(err => {
          const errorMessage = err.error?.message || err.message || "Une erreur s'est produite.";
          this.snackBar.open(errorMessage + ` ⛔`, "OK", { duration: 3000 });
          return EMPTY;
        })
      ).subscribe({
        error: err => {
          const errorMessage = err.error?.message || err.message || "Une erreur s'est produite.";
          this.snackBar.open(errorMessage + ` ⛔`, "OK", { duration: 3000 });
          return EMPTY;
        }
      });
    }
  }

  /**
   * this function allows to download excel template
   */
  downloadFile(): void {
    this.prospectService.downloadCustomerExcelTemplate(this.localStorageService.getCurrentCompanyId())
      .pipe(
        tap((response: BlobPart) => {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'prospects_template.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url); // Free up memory
        })
      ).subscribe();
  }


  closeImportZone() {
    this.isShowImportZone.next(false);
    this.selectedFile = null;
  }

  toggleRowSelection(rowId: number): void {
    if (this.selectedRows.has(rowId)) {
      this.selectedRows.delete(rowId);
    } else {
      this.selectedRows.add(rowId);
    }
    this.checkIfAllSelected();
  }

  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.selectedRows.clear(); // Deselect all
    } else {
      this.dataSource.data.forEach((row) => this.selectedRows.add(row.id)); // Select all
    }
    this.isAllSelected = !this.isAllSelected;
  }

  checkIfAllSelected(): void {
    this.isAllSelected = this.dataSource.data.every((row) => this.selectedRows.has(row.id));
  }

  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }


  /**
   * map display columns to array of strings
   */
  get getDisplayColumnsTable(): string[] {
    return this.displayedColumns.getValue().map(col => col.title);
  }

  getChipClass(status: string): string {
    switch (status) {
      case "nouvelle":
        return 'status-new'; // Apply class for "NEW"
      case "Qualsifiée":
        return 'status-qualified'; // Apply class for "QUALIFIED"
      case "Qualifiée":
        return 'status-interested'; // Apply class for "INTERESTED"
      case "OPPORTUNITY":
        return 'status-opportunity'; // Apply class for "OPPORTUNITY"
      case "CONVERTED":
        return 'status-converted'; // Apply class for "CONVERTED"
      case "DISQUALIFIED":
        return 'status-disqualified'; // Apply class for "DISQUALIFIED"
      case "LOST":
        return 'status-lost'; // Apply class for "LOST"
      case "NRP":
        return 'status-nrp'; // Apply class for "NRP"
      default:
        return 'status-default'; // Apply default class for unknown statuses
    }
  }

  /**
   * get Icon of status
   * @param status
   */
  getIcon(status: string): string {
    return this.statusIcons[status] || 'help'; // Default icon
  }

  /**
   * This function allows to delete prospect
   * @param row
   */
  deleteProspect(row: any): void {
    const dialogRef = ConfirmationDialogComponent.open(this.dialog, {
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet prospect ?',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      confirmButtonColor: 'warn'
    });

    dialogRef.subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        this.prospectService.deleteProspectById(row.id).pipe(tap({
          next: () => {
            // Remove the deleted item from the data source
            const index = this.dataSource.data.findIndex(p => p.id === row.id);
            if (index !== -1) {
              const updatedData = [...this.dataSource.data]; // Create a new array
              updatedData.splice(index, 1); // Remove the item
              this.dataSource.data = updatedData; // Assign the new array
            }

            // Show success message
            this.snackBar.open('Suppression confirmée avec succès !', 'Fermer', {
              duration: 3000, panelClass: ['success-snackbar'],
            });
          }, error: (error) => {
            // Handle server-side errors
            this.snackBar.open('Échec de la suppression. Veuillez réessayer.', 'Fermer', {
              duration: 3000, panelClass: ['error-snackbar'],
            });
            console.error('Error deleting prospect:', error);
          },
        })).subscribe();
      }
    });
  }

  /**
   *
   */
  bulkSoftDelete():void{
    const dialogRef = ConfirmationDialogComponent.open(this.dialog, {
      title: 'Confirmer la suppression',
      message: 'Confirmez-vous la suppression de ces clients ?',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      confirmButtonColor: 'warn'
    });

    dialogRef.subscribe(data => {
      if (data){
        this.prospectService.bulkSoftDelete(Array.from(this.selectedRows)).pipe(
          tap((response: boolean) => {
            if (response){
              this.dataSource.data =  this.dataSource.data.filter(customer => !Array.from(this.selectedRows).includes(customer.id))
              this.prospects.next(this.dataSource.data);
              this.snackBar.open("Les clients ont été supprimés avec succès.","OK", {duration:3000})
            }else{
              this.snackBar.open("Erreur lors de la suppression des clients.","OK", {duration:3000})
            }
          }),
          catchError(err => {
            this.snackBar.open("Erreur lors de la suppression des clients.","OK", {duration:3000})
            return of(null)
          })
        ).subscribe()
      }
    })
  }


  /**
   * hide show displayed columns drop down
   */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Hide or display column
   * @param column
   */
  toggleSelection(column: DisplayColumnsInterface) {
    if (this.displayedColumns.getValue().map(col => col.title).includes(column.title)) {
      this.displayedColumns.next(this.displayedColumns.getValue()
        .filter((col) => col.title !== column.title)
        .sort((a, b) => a.order - b.order))
    } else {
      this.displayedColumns.next([...this.displayedColumns.getValue(), column]);
      this.displayedColumns.getValue().sort((a, b) => a.order - b.order)
    }
  }

  /**
   * this function allows to check displayed columns
   * @param column
   */
  isColumnsChecked(column: DisplayColumnsInterface): boolean {
    return !!this.displayedColumns.getValue().find(col => col.title === column.title);
  }

  /**
   * This function allows to export customers
   * If the user select somme customers the file will contain just selected customers
   * Else download all customers as Excel file
   */
  exportExcelFile() {
    let selectedCustomerIds: number[] = [];

    if (this.selectedRows.size) {
      selectedCustomerIds = Array.from(this.selectedRows);
    }

    this.prospectService.exportExcelFile(this.localStorageService.getCurrentCompanyId(), selectedCustomerIds)
      .pipe(tap((response: BlobPart) => {
        const blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Prospects.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })).subscribe();
  }

  /**
   * This function allows to get all data to fill filters
   */
  loadFiltersData(){
    this.customerStatusService.getAllActiveStatuses().subscribe(status => this.customerStatus.next(status))
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
   *
   */
  toggleFilters() {
    if(!this.isFiltersVisible){
      this.prospectService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(
        tap((data) => {
          this.prospects.next(data)
          this.paginator.firstPage()
        })
      ).subscribe()
    }
    this.isFiltersVisible.next(!this.isFiltersVisible.getValue())
  }

  /**
   * this function allows to filter customers by filter fields
   */
  filterProspectsSearchFields() {
    const prospectFilterRequestDto: ProspectFilterRequestDto = new ProspectFilterRequestDto(
      this.fieldFilterForm.value.statusIds,
      this.fieldFilterForm.value.industryIds,
      this.fieldFilterForm.value.cityIds,
      this.fieldFilterForm.value.countryIds,
      this.fieldFilterForm.value.companySizeIds,
      this.fieldFilterForm.value.structureIds,
      this.fieldFilterForm.value.legalStatusIds,
      this.fieldFilterForm.value.createdByIds,
      this.fieldFilterForm.value.updatedByIds,
      this.localStorageService.getCurrentCompanyId(),
      this.fieldFilterForm.value.filterType,
      this.fieldFilterForm.value.createdAtStart,
      this.fieldFilterForm.value.createdAtEnd,
      this.fieldFilterForm.value.updatedAtStart,
      this.fieldFilterForm.value.updatedAtEnd,
      this.fieldFilterForm.value.affectedToIds
    );
    this.prospectService.getProspectByFilter(prospectFilterRequestDto).subscribe((response) => {
      this.prospects.next(response);
      this.dataSource.data = response;
      this.paginator.firstPage();
    });
  }

  /**
   * this function allows to rest filter and load all prospects
   */
  restFilterFrom() {
    this.fieldFilterForm.reset()
    this.prospectService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(tap(data => {
      this.prospects.next(data)
      this.dataSource.data = data;
      this.paginator.firstPage()
    })).subscribe()
  }

  /**
   *
   */
  bulkEdit() {
    const dialogRef = this.dialog.open(CustomerBulkEditComponent, {
      data: this.selectedRows,
      maxWidth: '70vw'
    });

    dialogRef.afterClosed().pipe(
      filter(result => !!result), // Ensure a valid result
      switchMap(() => this.loadCustomers()), // Reload customers
      tap(data => {
        this.loadCustomers()
        this.selectedRows.clear();
        this.paginator.firstPage();
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des clients:', error);
        this.snackBar.open('Erreur de mise à jour.', 'Fermer', { duration: 3000 });
        return of([]); // Prevent subscription errors
      }),
      take(1) // Ensure only one execution
    ).subscribe({
      next:() => {
        this.loadCustomers();
      }
    });
  }



}
