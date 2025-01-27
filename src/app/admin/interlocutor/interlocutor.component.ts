import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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
import {MatCheckbox} from '@angular/material/checkbox';
import {MatChip} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatTabLink, MatTabNav, MatTabNavPanel} from '@angular/material/tabs';
import {Router, RouterLink} from '@angular/router';
import {BehaviorSubject, catchError, EMPTY, filter, tap} from 'rxjs';
import {InterlocutorService} from '../../../services/Leads/interlocutor.service';
import {MatDialog} from '@angular/material/dialog';
import {ProspectStatus} from '../../../enums/prospect.status';
import {AddUpdateInterlocutorComponent} from './add-update-interlocutor/add-update-interlocutor.component';
import {InterlocutorResDto} from '../../../dtos/response/interlocutor.dto';
import {ConfirmationDialogComponent} from "../../utils/confirmation-dialog/confirmation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-interlocutor',
  standalone: true,
  imports: [
    KeyValuePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatChip,
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
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    MatTable,
    NgForOf,
    NgIf,
    RouterLink,
    MatMenuTrigger,
    NgClass,
    MatHeaderCellDef,
    MatNoDataRow
  ],
  templateUrl: './interlocutor.component.html',
  styleUrl: './interlocutor.component.css'
})
export class InterlocutorComponent implements  OnInit, AfterViewInit{
  interlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([]);
  displayedColumns: string[] = ['select','name','phone', 'email', 'enterprise','status','department','job_title','actions'];
  dataSource: MatTableDataSource<InterlocutorResDto> = new MatTableDataSource();
  isShowImportZone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  selectedFile: File | null = null;
  links: string[] = [];
  activeLink: string | null = ProspectStatus.NEW;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private interlocutorService: InterlocutorService, private dialog: MatDialog,private snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
    this.interlocutorService.getAllInterlocutors().pipe(tap((interlocutors) => {
      this.interlocutors.next(interlocutors);

      this.dataSource.data = interlocutors;
      this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
        // Customize filter logic for specific columns
        return data.fullName.toLowerCase().includes(filter) ||
          data.phoneNumber.number.toLowerCase().includes(filter) ||
          data.emailAddress.address.toLowerCase().includes(filter) ||
          data.prospect.name.toLowerCase().includes(filter)

      };
    })).subscribe()
  }

  ngAfterViewInit() {
    console.log(this.interlocutors);
  }


  /**
   *
   * @param event
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  /**
   * This function allows to open dialog to add new interlocutor
   */
  openAddInterlocutor(interlocutor?: InterlocutorResDto): void {
    const dialogRef = this.dialog.open(AddUpdateInterlocutorComponent, {
      maxWidth: '900px',
      maxHeight: '100vh',
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
  getProspectStatusLabel(status: string): string {
    return ProspectStatus[status as keyof typeof ProspectStatus] || "Unknown Status";
  }

  getChipClass(status: string): string {
    switch (status) {
      case "NEW":
        return 'status-new'; // Apply class for "NEW"
      case "QUALIFIED":
        return 'status-qualified'; // Apply class for "QUALIFIED"
      case "INTERESTED":
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

  getIcon(status: string): string {
    return this.statusIcons[status] || 'help'; // Default icon
  }

  showInterlocutorDetails(row: InterlocutorResDto) {
    this.router.navigateByUrl('/admin/interlocutors/'+ row.id)
  }

  // Delete Use component comfirmation dialog
  deleteIntelocutor(row: any): void {
    const dialogRef = ConfirmationDialogComponent.open(this.dialog, {
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
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
}
