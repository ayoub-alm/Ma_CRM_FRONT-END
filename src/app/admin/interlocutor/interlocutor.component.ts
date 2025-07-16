import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {KeyValuePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatTabNavPanel} from '@angular/material/tabs';
import {Router} from '@angular/router';
import {BehaviorSubject, catchError, EMPTY, filter, of, tap} from 'rxjs';
import {InterlocutorService} from '../../../services/Leads/interlocutor.service';
import {MatDialog} from '@angular/material/dialog';
import {ProspectStatus} from '../../../enums/prospect.status';
import {AddUpdateInterlocutorComponent} from './add-update-interlocutor/add-update-interlocutor.component';
import {InterlocutorResDto} from '../../../dtos/response/interlocutor.dto';
import {ConfirmationDialogComponent} from "../../utils/confirmation-dialog/confirmation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

import {ActiveEnum} from "../../../enums/active.enum";
import {DisplayColumnsInterface} from '../../utils/spider.table';
import {LocalStorageService} from '../../../services/local.storage.service';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatSelect} from '@angular/material/select';
import {PaginatorModule} from 'primeng/paginator';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DepartmentModel} from '../../../models/department.model';
import {JobTitleResponseDto} from '../../../dtos/init_data/response/job.title.response.dto';
import {ProspectResponseDto} from '../../../dtos/response/prospect.response.dto';
import {ProspectService} from '../../../services/Leads/prospect.service';
import {JobTitleService} from '../../../services/data/job.title.service';
import {DepartmentService} from '../../../services/data/department.service';
import {UsersService} from '../../../services/users.service';
import {InterlocutorsFilterRequestDto} from '../../../dtos/filters/interlocutorFilterRequestDto';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from '@angular/material/datepicker';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {CommentComponent} from '../../utils/comment/comment.component';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-interlocutor',
  standalone: true,
  imports: [
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatMenu,
    MatMenuItem,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    NgForOf,
    NgIf,
    MatMenuTrigger,
    NgClass,
    MatHeaderCellDef,
    MatNoDataRow,
    KeyValuePipe,
    MatFormField,
    MatLabel,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    PaginatorModule,
    ReactiveFormsModule,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatStartDate, MatDrawerContainer, MatDrawer,
    MatSuffix, MatDatepickerModule, MatToolbar, CommentComponent, TranslatePipe
  ],
  templateUrl: './interlocutor.component.html',
  styleUrl: './interlocutor.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterlocutorComponent implements  OnInit{
  interlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  allTableColumns: BehaviorSubject<DisplayColumnsInterface[]> = new BehaviorSubject<DisplayColumnsInterface[]>([
    { order: 0, title: 'select', label: 'Sélectionner' },
    { order: 1, title: 'name', label: 'Nom' },
    { order: 2, title: 'enterprise', label: 'Entreprise' },
    { order: 3, title: 'phone', label: 'Téléphone' },
    { order: 4, title: 'email', label: 'E-mail' },
    { order: 5, title: 'status', label: 'Statut' },
    { order: 6, title: 'department', label: 'Département' },
    { order: 7, title: 'job_title', label: 'Titre du poste' },
    { order: 8, title: 'actions', label: 'Actions' }
  ]);

  displayedColumns: BehaviorSubject<DisplayColumnsInterface[]> = new BehaviorSubject<DisplayColumnsInterface[]>([
    { order: 0, title: 'select', label: 'Sélectionner' },
    { order: 1, title: 'name', label: 'Nom' },
    { order: 2, title: 'enterprise', label: 'Entreprise' },
    { order: 3, title: 'phone', label: 'Téléphone' },
    { order: 4, title: 'email', label: 'E-mail' },
    { order: 5, title: 'status', label: 'Statut' },
    { order: 6, title: 'department', label: 'Département' },
    { order: 7, title: 'job_title', label: 'Titre du poste' },
    { order: 8, title: 'actions', label: 'Actions' }
  ]);
  dataSource: MatTableDataSource<InterlocutorResDto> = new MatTableDataSource();
  isShowImportZone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  selectedFile: File | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dropdownOpen: boolean = false ;
  isFiltersVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fieldFilterForm!:FormGroup;
  departements: BehaviorSubject<DepartmentModel[]> = new BehaviorSubject<DepartmentModel[]>([]);
  jobTitles: BehaviorSubject<JobTitleResponseDto[]> = new BehaviorSubject<JobTitleResponseDto[]>([]);
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  users: BehaviorSubject<any> = new BehaviorSubject<any[]>([]);
  constructor(private interlocutorService: InterlocutorService, private dialog: MatDialog, private snackBar: MatSnackBar,
              protected router: Router, private localStorageService: LocalStorageService, private fb: FormBuilder,
              private customersService: ProspectService,private jobTitleService: JobTitleService,
              private departmentService: DepartmentService, private userService: UsersService) {
    this.fieldFilterForm = fb.group({
      status: [''],
      customersIds: [''],
      departments: [''],
      jobTitlesIds: [''],
      createdByIds:[''],
      updatedByIds:[""],
      createdAtStart: [null],  // Date de début de création
      createdAtEnd: [null],    // Date de fin de création
      updatedAtStart: [null],  // Date de début de mise à jour
      updatedAtEnd: [null],
      filterType:["OR"]
    })
  }

  ngOnInit(): void {
    this.loadInterlocutors(this.localStorageService.getCurrentCompanyId())
    this.loadDataForFiltersData()
  }

  /**
   * Loads the interlocutors associated with a specific company and applies filtering based on the provided search value.
   *
   * @param {number} companyId - The ID of the company for which the interlocutors are being retrieved.
   * @param {string} [searchValue=""] - An optional search query used to filter the interlocutors by specific fields.
   * @return {void} This method does not return a value. It updates the internal state by triggering changes in observers and data source.
   */
  loadInterlocutors(companyId:number, searchValue:string = ""): void{
    this.interlocutorService.getAllInterlocutorsByCompanyId(companyId,searchValue).pipe(
      tap((interlocutors) => {
      this.interlocutors.next(interlocutors);
      this.dataSource.data = interlocutors;
      this.paginator.firstPage()
      }),
      catchError(error => {
        console.error('Error loading interlocutors:', error);
        this.snackBar.open('Error loading interlocutors', 'Close', { duration: 3000 });
        return EMPTY;
      })
    ).subscribe()
  }

  /**
   * Loads data for filters including customers, job titles, and departments.
   * This method fetches data from respective services and updates the corresponding observables.
   *
   * @return {void} This method does not return a value.
   */
  loadDataForFiltersData(): void{
    // fetch customers
    this.customersService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(
      tap((customers) => {
        this.customers.next(customers);
      })
    ).subscribe()
    // fetch job titles
    this.jobTitleService.getAllJobTitles().pipe(
      tap((jobTitles) => {
        this.jobTitles.next(jobTitles);
      })
    ).subscribe()
    // fetch departments
    this.departmentService.getAllDepartment().pipe(
      tap((departments) => {
        this.departements.next(departments);
      })
    ).subscribe()
    //fetch all users
    this.userService.getAllUsers().pipe().subscribe(users => {
      this.users.next(users);
    })
  }

  /**
   *
   * @param event
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.loadInterlocutors(this.localStorageService.getCurrentCompanyId(), filterValue);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * This function allows to open dialog to add new interlocutor
   */
  openAddInterlocutor(interlocutor?: InterlocutorResDto): void {
    console.log(interlocutor);
    const dialogRef = this.dialog.open(AddUpdateInterlocutorComponent, {
      maxWidth: '900px',
      maxHeight: '100vh',
      data: interlocutor ? interlocutor :null
    });
    dialogRef.afterClosed().pipe(
        filter(response => !!response), // Proceed only if response is not null/undefined
        tap(response => {
          console.log('Dialog closed with response:', response); // Debugging statement

          const existingItemIndex = this.dataSource.data.findIndex(item => item.id === response.id);
          console.log("message " ,existingItemIndex)
          if (existingItemIndex !== -1) {
            // Update existing item
            const updatedData = [...this.dataSource.data];
            updatedData[existingItemIndex] = response;
            this.dataSource.data = updatedData; // Assign new array to trigger change detection
          } else {
            // Add new item
            this.dataSource.data = [...this.dataSource.data, response]; // Create new array with added item
          }
          // Reset paginator to the first page
          if (this.paginator) {
            this.paginator.firstPage();
          }
        }),
        catchError(error => {
          console.error('Error after dialog closed:', error); // Debugging statement
          this.snackBar.open('Error updating interlocutor list', 'Close', { duration: 3000 });
          return EMPTY;
        })
    ).subscribe();
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
      // this.prospectService.uploadFile(this.selectedFile).pipe(tap(data => {
      //   this.dataSource.data = [...this.dataSource.data, ...data];
      //   this.paginator.firstPage();
      // })).subscribe()
    }
  }

  /**
   * this function allows to download excel template
   */
  downloadFile(): void {
    // URL or Blob for the file you want to download
    const fileUrl = '/prospects_template.xlsx'; // Replace with actual file URL or Blob
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'prospects_template.xlsx';  // Specify the name of the file to be downloaded
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Closes the import zone by setting the visibility to false and clearing the selected file.
   *
   * @return {void} Does not return a value.
   */
  closeImportZone() {
    this.isShowImportZone.next(false);
    this.selectedFile = null;
  }

  /**
   * Toggles the selection state of a row based on its identifier. If the row is currently selected,
   * it will be deselected, and vice versa.
   *
   * @param {number} rowId - The unique identifier of the row to toggle selection for.
   * @return {void} - Does not return a value.
   */
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

  /**
   * Checks whether all rows in the data source are selected and updates the `isAllSelected` property accordingly.
   * The method iterates over all rows in the data source and verifies if their IDs are present in the set of selected rows.
   *
   * @return {void} No value is returned.
   */
  checkIfAllSelected(): void {
    this.isAllSelected = this.dataSource.data.every((row) => this.selectedRows.has(row.id));
  }

  /**
   * Checks if a row with the given row ID is selected.
   *
   * @param {number} rowId - The unique identifier of the row to check.
   * @return {boolean} True if the row is selected, otherwise false.
   */
  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }

  getAllStatusInteraction(status: string): string {
    return ActiveEnum[status as keyof typeof ActiveEnum] || "Unknown Status";
  }

  getChipClass(status: string): string {
    switch (status) {
      case "ACTIVE":
        return 'status-active'; // Apply class for "NEW"
      case "INACTIVE":
        return 'status-inactive'; // Apply class for "QUALIFIED"
      default:
        return 'status-default'; // Apply default class for unknown statuses
    }
  }

  // Mapping icons to ProspectStatus values
  statusIcons: Record<string, string> = {
    [ActiveEnum.ACTIVE]: 'fiber_new',
    [ActiveEnum.INACTIVE]: 'thumb_up',
  };

  getIcon(status: string): string {
    return this.statusIcons[status] || 'help'; // Default icon
  }

  /**
   * Navigates to the Interlocutor details page based on the provided row data.
   *
   * @param {InterlocutorResDto} row - The data object representing a specific interlocutor.
   * @return {void} Does not return any value.
   */
  showInterlocutorDetails(row: InterlocutorResDto) {
    this.router.navigateByUrl('/admin/interlocutors/'+ row.id)
  }

  /**
   * Deletes an interlocutor after confirmation. Displays a confirmation dialog,
   * and if the action is confirmed, removes the corresponding interlocutor
   * from the data source and provides feedback to the user via snackbar messages.
   *
   * @param row The data object representing the interlocutor to be deleted. It must contain an `id` property.
   * @return void This method does not return anything.
   */
  deleteInterlocutor(row: any): void {
    const dialogRef = ConfirmationDialogComponent.open(this.dialog, {
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet Interlocuteur ?',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      confirmButtonColor: 'warn', // Set the confirm button color to red
    });
    dialogRef.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.interlocutorService.deleteInterlocutorById(row.id).pipe(tap({
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
                  duration: 3000,
                  panelClass: ['success-snackbar'],
                });
              },
              error: (error) => {
                // Handle server-side errors
                this.snackBar.open('Échec de la suppression. Veuillez réessayer.', 'Fermer', {
                  duration: 3000,
                  panelClass: ['error-snackbar'],
                });
                console.error('Error deleting interlocutor:', error);
              },
            })
        ).subscribe();
      }
    });
  }

  /**
   * hide show displayed columns drop down
   */
  toggleDropdownOfVisibleColumns() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * this function allows to check displayed columns
   * @param column
   */
  isColumnsChecked(column: DisplayColumnsInterface): boolean{
    return !!this.displayedColumns.getValue().find(col => col.order === column.order);
  }

  /**
   * Toggles the selection of a column by adding it to or removing it from the displayed columns list.
   * If the specified column is already included, it will be removed. If it is not included, it will be added.
   *
   * @param {DisplayColumnsInterface} column - The column to be toggled in the displayed columns list.
   * @return {void} This method does not return a value.
   */
  toggleSelection(column: DisplayColumnsInterface): void {
    if (this.displayedColumns.getValue().map(col => col.title).includes(column.title)) {
      this.displayedColumns.next(this.displayedColumns.getValue()
        .filter((col) => col.title !== column.title)
        .sort((a, b)=> a.order - b.order))  }
    else {
      this.displayedColumns.next([... this.displayedColumns.getValue(),column]);
      this.displayedColumns.getValue().sort((a, b)=> a.order - b.order)
    }
  }

  /**
   * map display columns to array of strings
   */
  get getDisplayColumnsTable(): string[]{
    return this.displayedColumns.getValue().map(col => col.title);
  }

  /**
   * Toggles the visibility of the filters. If the filters are not visible, it retrieves the interlocutors
   * for the current company and updates the related data observable and the paginator to the first page.
   *
   * @return {void} Does not return anything.
   */
  toggleFilters() {
    if(!this.isFiltersVisible){
      this.loadInterlocutors(this.localStorageService.getCurrentCompanyId())
    }
    this.isFiltersVisible.next(!this.isFiltersVisible.getValue())
  }

  protected readonly ProspectStatus = ProspectStatus;

  /**
   * Resets the field filter form and fetches updated interlocutor data for the current company.
   * The fetched data is used to update the list of interlocutors and reset the paginator to the first page.
   *
   * @return {void} This method does not return a value.
   */
  restFilterFrom() {
    this.fieldFilterForm.reset();
    this.loadInterlocutors(this.localStorageService.getCurrentCompanyId());
  }

  /**
   * Filters interlocutors based on the specified search fields obtained from the form and company context.
   * Constructs a filter object using form values and the current company ID, then fetches the filtered results.
   *
   * @return {void} This method does not return a value, it performs a filtering operation and triggers a service call.
   */
  filterInterlocutorsBySearchFields() {
    const filters: InterlocutorsFilterRequestDto = new InterlocutorsFilterRequestDto(
      this.fieldFilterForm.get('status')?.value,
      this.fieldFilterForm.get('customersIds')?.value,
      this.fieldFilterForm.get('departments')?.value,
      this.fieldFilterForm.get('jobTitlesIds')?.value,
      this.fieldFilterForm.get('createdByIds')?.value,
      this.fieldFilterForm.get('createdByIds')?.value,
      this.fieldFilterForm.get('filterType')?.value,
      this.localStorageService.getCurrentCompanyId(),
      this.fieldFilterForm.value.createdAtStart,
      this.fieldFilterForm.value.createdAtEnd,
      this.fieldFilterForm.value.updatedAtStart,
      this.fieldFilterForm.value.updatedAtEnd,
    )
    //fetch data and reload table
    this.interlocutorService.getInterlocutorsByFilters(filters).pipe(
      tap((interlocutors) => {
        this.interlocutors.next(interlocutors);
        this.dataSource.data = interlocutors;
        this.paginator.firstPage()
      }),
      catchError(error => {
        console.error('Error loading interlocutors:', error);
        this.snackBar.open('Error loading interlocutors', 'Close', { duration: 3000 });
        return EMPTY;
      })
    ).subscribe()
  }

  /**
   * Initiates a bulk soft delete operation for the selected interlocutors.
   * Displays a confirmation dialog before performing the deletion. On confirmation,
   * the selected interlocutors are marked for deletion and the data source is updated accordingly.
   *
   * @return {void} No return value.
   */
  bulkSoftDelete():void{
    const dialogRef = ConfirmationDialogComponent.open(this.dialog, {
      title: 'Confirmer la suppression',
      message: 'Confirmez-vous la suppression de ces interlocuteurs ?',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      confirmButtonColor: 'warn'
    });

    dialogRef.subscribe(data => {
      if (data){
        this.interlocutorService.bulkSoftDelete(Array.from(this.selectedRows)).pipe(
          tap((response: boolean) => {
            if (response){
              this.dataSource.data =  this.dataSource.data.filter(customer => !Array.from(this.selectedRows).includes(customer.id))
              this.interlocutors.next(this.dataSource.data);
              this.snackBar.open("Les interlocuteurs ont été supprimés avec succès.","OK", {duration:3000})
            }else{
              this.snackBar.open("Erreur lors de la suppression des interlocuteurs.","OK", {duration:3000})
            }
          }),
          catchError(err => {
            this.snackBar.open("Erreur lors de la suppression des interlocuteurs.","OK", {duration:3000})
            return of(null)
          })
        ).subscribe()
      }
    })
  }

  exportExcelFile() {
    let selectedCustomerIds: number[] = [];

    if (this.selectedRows.size) {
      selectedCustomerIds = Array.from(this.selectedRows);
    }

    this.interlocutorService.exportExcelFile(this.localStorageService.getCurrentCompanyId(), selectedCustomerIds)
      .pipe(tap((response: BlobPart) => {
        const blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'interlocuteurs.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })).subscribe();
  }
}
