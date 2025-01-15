import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
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
import {getAllStatusLabel, ProspectStatus} from '../../../enums/prospect.status';
import {AddUpdateInterlocutorComponent} from './add-update-interlocutor/add-update-interlocutor.component';
import {InterlocutorResDto} from '../../../dtos/response/interlocutor.dto';
import {ActiveEnum, getAllStatusInteraction} from "../../../enums/active.enum";

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
  // activeLink: string | null = ActiveEnum.NEW;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private interlocutorService: InterlocutorService, private dialog: MatDialog, private router: Router) {
    this.links = getAllStatusInteraction(); // Populate with ProspectStatus labels
    // if (this.links.length > 0) {
    //   this.activeLink = this.links[0];
    // }
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
      data: interlocutor, // Pass the interlocutor if provided
    });



    dialogRef.afterClosed().pipe(
      filter(response => !!response), // Proceed only if response is not null/undefined
      tap(response => {
        const existingItemIndex = this.dataSource.data.findIndex(item => item.id === response.id);

        console.log("exists", existingItemIndex, response);
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
        this.paginator.firstPage();
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

  showInterlocutorDetails(row: InterlocutorResDto) {
    this.router.navigateByUrl('/admin/interlocutors/'+ row.id)
  }
}
