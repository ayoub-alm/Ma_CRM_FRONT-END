import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { InteractionResponseDto } from '../../../dtos/response/interaction.response.dto';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { InteractionService } from '../../../services/Leads/interaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AddEditInteractionDialogComponent } from './add-edit-interaction-dialog/add-edit-interaction-dialog.component';
import { ConfirmationDialogComponent } from "../../utils/confirmation-dialog/confirmation-dialog.component";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayColumnsInterface } from '../../utils/spider.table';
import { LocalStorageService } from '../../../services/local.storage.service';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { ProspectStatus } from '../../../enums/prospect.status';
import { ProspectResponseDto } from '../../../dtos/response/prospect.response.dto';
import { ProspectService } from '../../../services/Leads/prospect.service';
import { InteractionType } from '../../../enums/interaction.type';
import { InteractionSubject } from '../../../enums/interaction.subject';
import { UsersService } from '../../../services/users.service';
import { InterlocutorResDto } from '../../../dtos/response/interlocutor.dto';
import { InterlocutorService } from '../../../services/Leads/interlocutor.service';
import { InteractionFilterDto } from '../../../dtos/filters/interaction.filter.request.dto';
import {
  MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker, MatEndDate, MatStartDate
} from '@angular/material/datepicker';
import { TranslatePipe } from '@ngx-translate/core';
import { CalendarComponent } from '../../utils/calendar/calendar.component';


@Component({
  selector: 'app-interaction',
  standalone: true,
  imports: [MatCell, MatHeaderCell, MatColumnDef, MatHeaderCellDef, MatMenuTrigger, MatMenu, MatIcon, MatPaginator,
    DatePipe, MatTable, MatInput, MatButton, MatIconButton, MatMenuItem, MatHeaderRow, MatRow, MatSort, MatDatepickerModule,
    MatSortHeader, MatCellDef, MatHeaderRowDef, MatRowDef, MatNoDataRow, NgClass, NgForOf, NgIf, FormsModule, KeyValuePipe,
    MatFormField, MatLabel, MatOption, MatRadioButton, MatRadioGroup, MatSelect, ReactiveFormsModule, AsyncPipe,
    MatDateRangeInput, MatDateRangePicker, MatDatepickerToggle, MatEndDate, MatStartDate, MatSuffix, TranslatePipe, CalendarComponent],
  templateUrl: './interaction.component.html',
  styleUrl: './interaction.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractionComponent implements OnInit, AfterViewInit {

  allTableColumns: BehaviorSubject<DisplayColumnsInterface[]> = new BehaviorSubject<DisplayColumnsInterface[]>([{
    order: 0,
    title: 'select',
    label: 'Sélectionner'
  }, { order: 1, title: 'prospectName', label: 'Client' }, {
    order: 2,
    title: 'interlocutorName',
    label: 'Nom de l\'interlocuteur'
  }, { order: 3, title: 'interactionSubject', label: 'Sujet d\'interaction' }, {
    order: 4,
    title: 'interactionType',
    label: 'Type d\'interaction'
  }, { order: 5, title: 'planningDate', label: 'Date de planification' }, {
    order: 6,
    title: 'status',
    label: 'Statut'
  }, { order: 7, title: 'affectedTo', label: 'Affecté à' }, { order: 8, title: 'actions', label: 'Actions' }]);

  displayedColumns: BehaviorSubject<DisplayColumnsInterface[]> = new BehaviorSubject<DisplayColumnsInterface[]>([{
    order: 0,
    title: 'select',
    label: 'Sélectionner'
  }, { order: 1, title: 'prospectName', label: 'Nom du prospect' }, {
    order: 2,
    title: 'interlocutorName',
    label: 'Nom de l\'interlocuteur'
  }, { order: 3, title: 'interactionSubject', label: 'Sujet d\'interaction' }, {
    order: 4,
    title: 'interactionType',
    label: 'Type d\'interaction'
  }, { order: 5, title: 'planningDate', label: 'Date de planification' }, {
    order: 6,
    title: 'status',
    label: 'Statut'
  }, { order: 7, title: 'affectedTo', label: 'Affecté à' }, { order: 8, title: 'actions', label: 'Actions' }]);

  dataSource: MatTableDataSource<InteractionResponseDto> = new MatTableDataSource();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  dropdownOpen: boolean = false;

  fieldFilterForm!: FormGroup;
  isFiltersVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isShowImportZone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  viewMode: BehaviorSubject<'table' | 'agenda'> = new BehaviorSubject<'table' | 'agenda'>('table');
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  users: BehaviorSubject<any> = new BehaviorSubject<any[]>([]);
  interlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  protected readonly ProspectStatus = ProspectStatus;
  protected readonly InteractionType = InteractionType;
  protected readonly InteractionSubject = InteractionSubject;

  constructor(private interactionService: InteractionService, private dialog: MatDialog, private snackBar: MatSnackBar, protected router: Router, private localStorageService: LocalStorageService, private fb: FormBuilder, private customersService: ProspectService, private userService: UsersService, private interlocutorsService: InterlocutorService) {
    this.fieldFilterForm = this.fb.group({
      interactionTypes: [[]], // Fixed key to match API DTO
      interactionSubjects: [[]],
      customerIds: [[]],
      interlocutorIds: [[]],
      createdByIds: [[]],
      updatedByIds: [[]],
      affectedToIds: [[]],
      startDate: [null],
      endDate: [null],
      filterType: ["OR"],
      createdAtStart: [null],  // Date de début de création
      createdAtEnd: [null],    // Date de fin de création
      updatedAtStart: [null],  // Date de début de mise à jour
      updatedAtEnd: [null],
    });


  }

  ngOnInit(): void {
    this.loadInteractions();
    this.loadDataForFiltersData();
  }

  /**
   * Loads and initializes data for filters including customers, users, and interlocutors.
   * The data is fetched asynchronously and updates the corresponding observables.
   *
   * @return {void} No return value.
   */
  loadDataForFiltersData(): void {
    // fetch customers
    this.customersService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(
      tap((customers) => { this.customers.next(customers); })).subscribe()
    //fetch all users
    this.userService.getAllUsers().pipe().subscribe(users => {
      this.users.next(users);
    })
    // fetch all interlocutors
    this.interlocutorsService.getAllInterlocutorsByCompanyId(this.localStorageService.getCurrentCompanyId()).pipe(
      tap(interlocutors => { this.interlocutors.next(interlocutors) })).subscribe()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Loads interaction data for the current company and updates the data source.
   * Retrieves all interactions using the interaction service and sets the retrieved data into the data source.
   * Displays an error message via a snack bar notification if the data fetch fails.
   *
   * @return {void} This method does not return a value.
   */
  loadInteractions(searchValue: string = ""): void {
    this.interactionService.getAllInteractions(this.localStorageService.getCurrentCompanyId(), searchValue).subscribe({
      next: (data) => {
        this.dataSource.data = data.sort((a, b) => b.id - a.id);
      }, error: (err) => {
        this.snackBar.open("Erreur lors de téléchargement des interaction: " + err.message, "Fermer", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
    });
  }

  /**
   * Applies a filter based on the user's input.
   * This method processes the input value obtained from the triggered event,
   * sanitizes it by trimming whitespace and converting it to lowercase,
   * and then loads interactions based on the sanitized value.
   *
   * @param {Event} event - The event triggered by the input field, containing the user's input value.
   * @return {void} This method does not return a value.
   */
  applyFilter(event: Event): void {
    this.loadInteractions((event.target as HTMLInputElement).value.trim().toLowerCase());
  }

  /**
   * Opens a dialog for adding or editing an interaction. The dialog is displayed
   * with a maximum width of 900px. Once the dialog is closed, it checks the
   * result and reloads the list of interactions if a valid result is returned.
   *
   * @return {void} Does not return any value.
   */
  openAddInteractionDialog(): void {
    const dialogRef = this.dialog.open(AddEditInteractionDialogComponent, {
      maxWidth: '900px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadInteractions();
      }
    });
  }

  /**
   * Opens a dialog to edit an existing interaction and updates the interaction data upon confirmation.
   *
   * @param {InteractionResponseDto} row - The data of the interaction to be edited, passed to the dialog.
   * @return {void} This method does not return a value.
   */
  editInteraction(row: InteractionResponseDto): void {
    const dialogRef = this.dialog.open(AddEditInteractionDialogComponent, {
      maxWidth: '900px', data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadInteractions();
      }
    });
  }

  /**
   * Toggles the selection state of a table row based on the given row ID.
   *
   * @param {number} rowId - The unique identifier of the row to be toggled.
   * @return {void} This method does not return a value.
   */
  toggleRowSelection(rowId: number): void {
    if (this.selectedRows.has(rowId)) {
      this.selectedRows.delete(rowId);
    } else {
      this.selectedRows.add(rowId);
    }
    this.checkIfAllSelected();
  }

  /**
   * Toggles the selection state of all rows. If all rows are currently selected,
   * it clears the selection. Otherwise, it selects all rows by adding their IDs
   * to the selected rows set.
   *
   * @return {void} Does not return anything.
   */
  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.selectedRows.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  /**
   * Checks if all rows in the data source are selected and updates the `isAllSelected` property.
   * The method verifies whether all rows in the data source have their IDs stored in the `selectedRows` collection.
   *
   * @return {void} Updates the `isAllSelected` property based on the selection status of all rows.
   */
  checkIfAllSelected(): void {
    this.isAllSelected = this.dataSource.data.every((row) => this.selectedRows.has(row.id));
  }

  /**
   * Determines if a row with the given ID is selected.
   *
   * @param {number} rowId - The unique identifier of the row to check.
   * @return {boolean} Returns true if the row is selected, otherwise false.
   */
  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }

  /**
   * Navigates to the interaction details page for the specified interaction.
   *
   * @param {InteractionResponseDto} row - The interaction response object containing the details of the specific interaction.
   * @return {void} This method does not return a value.
   */
  showDetails(row: InteractionResponseDto): void {
    this.router.navigateByUrl('/admin/interactions/' + row.id).then(r => {
      return;
    });
  }

  getChipClass(report: string | null | undefined): string {
    return report !== null && report !== undefined && report !== '' ? 'status-complete' : 'status-not-complete';
  }

  getStatusLabel(report: string | null | undefined): string {
    return report !== null && report !== undefined && report !== '' ? 'Terminé' : '\'En attente\'';
  }

  /**
   * Deletes an interaction after user confirmation and updates the data source accordingly.
   * Displays a confirmation dialog to the user and processes the deletion upon confirmation.
   * Shows success or error messages based on the result of the operation.
   *
   * @param row - The interaction object to be deleted, containing its metadata (e.g., `id`).
   * @return void - Does not return a value.
   */
  deleteInteraction(row: any): void {
    const dialogRef = ConfirmationDialogComponent.open(this.dialog, {
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet Interaction ?',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      confirmButtonColor: 'warn', // Set the confirm button color to red
    });

    dialogRef.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.interactionService.softDeleteInteraction(row.id).pipe(tap({
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
            console.error('Error deleting interaction:', error);
          },
        })).subscribe();
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
  isColumnsChecked(column: DisplayColumnsInterface): boolean {
    return !!this.displayedColumns.getValue().find(col => col.order === column.order);
  }

  /**
   * Toggles the visibility state of filters. If the filters are currently hidden,
   * it triggers the loading of interactions before updating the visibility state.
   *
   * @return {void} This method does not return a value.
   */
  toggleFilters() {
    if (!this.isFiltersVisible) {
      this.loadInteractions()
    }
    this.isFiltersVisible.next(!this.isFiltersVisible.getValue())
  }

  /**
   * Retrieves the display columns by mapping over the current values and extracting their titles.
   *
   * @return {string[]} An array of strings representing the titles of the columns to be displayed.
   */
  getDisplayColumns(): string[] {
    return this.displayedColumns.getValue().map((col) => {
      return col.title
    })
  }

  /**
   * Performs a bulk soft delete of selected rows.
   * Prompts the user with a confirmation dialog before proceeding with the operation.
   * Displays appropriate success, error, and cancellation messages using a snackbar notification.
   * Reloads the interactions if the operation is successful.
   *
   * @return {void} Does not return any value.
   */
  bulkSoftDelete() {
    if (!this.selectedRows.size) {
      this.snackBar.open("Aucune interaction sélectionnée.", "Fermer", {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    const dialogRef = ConfirmationDialogComponent.open(this.dialog, {
      title: 'Confirmer la suppression',
      message: 'Confirmez-vous la suppression de ces interlocuteurs ?',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      confirmButtonColor: 'warn'
    });

    dialogRef.subscribe(confirmed => {
      if (confirmed) {
        this.interactionService.BulkSoftDeleteInteraction(Array.from(this.selectedRows.values()))
          .pipe(tap(response => {
            if (response) {
              this.snackBar.open("Les interactions ont bien été supprimées.", "Fermer", {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.loadInteractions();
            }
          }), catchError(error => {
            this.snackBar.open("Erreur lors de la suppression.", "Fermer", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            return throwError(() => error);
          })).subscribe();
      } else {
        this.snackBar.open("Suppression annulée.", "Fermer", { duration: 3000, panelClass: ['info-snackbar'] });
      }
    });
  }

  /**
   * Exports the selected rows into an Excel file and triggers a download for the generated file.
   *
   * The method checks for selected rows, converts their IDs into an array, and sends a request
   * to the interaction service to retrieve the Excel file. Once received, it processes the file
   * data and programmatically creates a download link for the user.
   *
   * @return {void} This method does not return a value.
   */
  exportExcelFile() {
    let selectedInteractionsIds: number[] = [];

    if (this.selectedRows.size) {
      selectedInteractionsIds = Array.from(this.selectedRows);
    }

    this.interactionService.exportExcelFile(this.localStorageService.getCurrentCompanyId(), selectedInteractionsIds)
      .pipe(tap((response: BlobPart) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'interactions.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })).subscribe();
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
        .sort((a, b) => a.order - b.order))
    } else {
      this.displayedColumns.next([...this.displayedColumns.getValue(), column]);
      this.displayedColumns.getValue().sort((a, b) => a.order - b.order)
    }
  }

  /**
   * Filters interactions using the search fields provided by the form.
   * Retrieves the current company ID from local storage and includes it in the filtering parameters.
   * Updates the data source with the filtered interactions on success.
   * Displays an error message in a snackbar in case of failure.
   *
   * @return {void} No return value. Performs side-effects such as updating the data source and showing messages.
   */
  filterInteractionsBySearchFields(): void {
    const filterData = new InteractionFilterDto(this.localStorageService.getCurrentCompanyId(),
      this.fieldFilterForm.value.customerIds, this.fieldFilterForm.value.interlocutorIds, this.fieldFilterForm.value.createdByIds,
      this.fieldFilterForm.value.affectedToIds, this.fieldFilterForm.value.interactionTypes,
      this.fieldFilterForm.value.interactionSubjects, this.fieldFilterForm.value.filterType,
      this.fieldFilterForm.value.createdAtStart, this.fieldFilterForm.value.createdAtEnd, this.fieldFilterForm.value.updatedAtStart,
      this.fieldFilterForm.value.updatedAtEnd);

    filterData.companyId = this.localStorageService.getCurrentCompanyId();

    this.interactionService.filterInteractions(filterData)
      .pipe(tap(interactions => {
        this.dataSource.data = interactions;
      }), catchError(error => {
        this.snackBar.open("Erreur lors du filtrage.", "Fermer", { duration: 3000, panelClass: ['error-snackbar'] });
        return throwError(() => error);
      })).subscribe();
  }

  /**
   * Resets the filter form to its default state, clearing all filter criteria.
   * The form fields are*/
  /**
   * Resets the filter form to its default state, clearing all filter criteria.
   * The form fields are reset to predefined*/
  resetFilterForm(): void {
    this.fieldFilterForm.reset({
      interactionTypes: [],
      interactionSubjects: [],
      customersIds: [],
      interlocutorsIds: [],
      createdByIds: [],
      affectedToIds: [],
      startDate: null,
      endDate: null,
      filterType: "OR"
    });
    this.loadInteractions();
  }

  /**
   * Toggles the view mode between 'table' and 'agenda' (calendar) views.
   *
   * @param {string} mode - The view mode to switch to ('table' or 'agenda').
   * @return {void} This method does not return a value.
   */
  toggleViewMode(mode: 'table' | 'agenda'): void {
    this.viewMode.next(mode);
  }
}
