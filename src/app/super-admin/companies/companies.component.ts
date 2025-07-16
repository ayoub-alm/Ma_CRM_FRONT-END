import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {BehaviorSubject, catchError, debounceTime, EMPTY, of, tap} from "rxjs";
import {CompanyResponseDto} from "../../../dtos/response/CompanyResponseDto";
import {CompanyService} from "../../../services/company.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTab, MatTabGroup, MatTabLabel, MatTabNavPanel} from "@angular/material/tabs";
import {environment} from '../../../environments/environment';
import {CompanyModel} from "../../models/super-admin/company.model";
import {AddUpdateCompanyComponent} from "../../workspace/companies/add-update-company/add-update-company.component";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from "@angular/material/datepicker";
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatSelect} from "@angular/material/select";
import {MatSort, MatSortHeader, MatSortModule} from "@angular/material/sort";
import {TranslatePipe} from "@ngx-translate/core";
import {getAllCustomerStatusLabel, ProspectStatus} from '../../../enums/prospect.status';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CheckboxModule} from 'primeng/checkbox';
import {MultiSelectModule} from 'primeng/multiselect';
import { DisplayColumnsInterface } from '../../utils/spider.table';
import { CompanySizeResponseDto } from '../../../dtos/init_data/response/company.size.response.dt';
import { LocalStorageService } from '../../../services/local.storage.service';
import {ProspectService} from '../../../services/Leads/prospect.service';
import {ProspectResponseDto} from '../../../dtos/response/prospect.response.dto';
import {AddProspectDialogComponent} from '../../admin/prospect/add-prospect-dialog/add-prospect-dialog.component';
import {ConfirmationDialogComponent} from '../../utils/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatCheckboxModule, CheckboxModule, MatMenu, MatMenuTrigger, MatMenuItem, NgIf, NgClass,
    MatTabNavPanel, MultiSelectModule, ReactiveFormsModule, DatePipe,  MatDatepickerModule,
    TranslatePipe],

  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit, AfterViewInit {
  displayedColumns: BehaviorSubject<DisplayColumnsInterface[]> = new BehaviorSubject<DisplayColumnsInterface[]>([
    { order: 0, title: 'select', label: 'Sélectionner' },
    { order: 1, title: 'name', label: 'Nom' },
    { order: 3, title: 'industry', label: 'Industrie' },
    { order: 4, title: 'city', label: 'Ville' },
    { order: 5, title: 'email', label: 'E-mail' },
    { order: 28, title: 'actions', label: 'Actions' }
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  selectedFile: File | null = null; // file xls\csv to upload
  isShowImportZone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  links: string[] = [];
  activeLink: BehaviorSubject<string> = new BehaviorSubject<string>("");
  dataSource: MatTableDataSource<CompanyResponseDto> = new MatTableDataSource(); // Initialized safely
  companies: BehaviorSubject<CompanyResponseDto[]> = new BehaviorSubject<CompanyResponseDto[]>([]);
  protected readonly ProspectStatus = ProspectStatus;
  searchForm!: FormGroup;
  fieldFilterForm!: FormGroup;
  isFiltersVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private dialog: MatDialog, private companyService: CompanyService, private snackBar: MatSnackBar,
              protected router: Router, private localStorageService: LocalStorageService, private fb: FormBuilder,) {
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
      statusIds:[[]],
      industryIds:[[]],
      cityIds:[[]],
      countryIds:[[]],
      companySizeIds:[[]],
      structureIds:[[]],
      legalStatusIds:[[]],
      createdByIds:[[]],
      updatedByIds:[[]],
      affectedToIds:[[]],
      createdAtStart: [null],  // Date de début de création
      createdAtEnd: [null],    // Date de fin de création
      updatedAtStart: [null],  // Date de début de mise à jour
      updatedAtEnd: [null]
    })
  }



  ngOnInit(): void {
    this.loadCustomers();
    this.listenSearchForm();
  }

  /**
   * fetch customers
   */
  loadCustomers():CompanyResponseDto[]  {
    this.companyService.getAllCompanies().subscribe({
      next: (data: CompanyResponseDto[]) => {
        this.companies.next(data);
        this.dataSource.data = data;
        this.paginator.firstPage();
        return data;
      }, error: (err) => {
        console.error('Error fetching prospects:', err);
      },
    });
    return this.companies.getValue();
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
        this.loadCustomers()
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
        // const index = this.dataSource.data.findIndex(p => p.id === row.id);
        // if (index !== -1) {
        //   this.dataSource.data[index] = result;
        // }
        this.loadCustomers();
      }
    });
  }

  /**
   * This function show import zone
   * @param row
   */
  showProspectDetails(row: ProspectResponseDto) {
    this.router.navigateByUrl(`/super-admin/companies/${row.id}`)
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
    switch (status.toLowerCase()) {
      case "nouvelle":
        return "status-new"; // "NEW"
      case "qualifiée":
        return "status-qualified"; // "QUALIFIED"
      case "intéressée":
        return "status-interested"; // "INTERESTED"
      case "opportunité":
        return "status-opportunity"; // "OPPORTUNITY"
      case "convertie":
        return "status-converted"; // "CONVERTED"
      case "disqualifiée":
        return "status-disqualified"; // "DISQUALIFIED"
      case "perdue":
        return "status-lost"; // "LOST"
      case "nrp":
        return "status-nrp"; // "NRP"
      default:
        return "status-default"; // Default class for unknown statuses
    }
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
}
