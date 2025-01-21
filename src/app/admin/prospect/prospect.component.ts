import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CheckboxModule } from 'primeng/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { AddProspectDialogComponent } from './add-prospect-dialog/add-prospect-dialog.component';
import {BehaviorSubject, tap} from 'rxjs';
import { ProspectResponseDto } from '../../../dtos/response/prospect.response.dto';
import { ProspectService } from '../../../services/Leads/prospect.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {Router, RouterLink} from '@angular/router';
import {KeyValuePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {getAllStatusLabel, ProspectStatus} from '../../../enums/prospect.status';
import {MatTabLink, MatTabNav, MatTabNavPanel} from '@angular/material/tabs';


@Component({
  selector: 'app-prospect',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    CheckboxModule,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    NgIf,
    NgClass,
    MatTabLink,
    MatTabNavPanel,
    MatTabNav,
    NgForOf,
    KeyValuePipe,
    RouterLink,
  ],
  templateUrl: './prospect.component.html',
  styleUrls: ['./prospect.component.css'], // Corrected `styleUrl` to `styleUrls`
})
export class ProspectComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select','name','status','industry','city', 'email', 'phone','description', 'actions'];
  dataSource: MatTableDataSource<ProspectResponseDto> = new MatTableDataSource(); // Initialized safely
  prospects: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedFile: File | null = null; // file xls\csv to upload
  isShowImportZone: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  links: string[] = [];
  activeLink: string | null = ProspectStatus.NEW;


  constructor(private dialog: MatDialog, private prospectService: ProspectService, private snackBar: MatSnackBar,
              private router: Router  ) {
    this.links = getAllStatusLabel(); // Populate with ProspectStatus labels
    if (this.links.length > 0) {
      this.activeLink = this.links[0];
    }
  }

  ngOnInit(): void {
    // Fetch and populate prospects data
    this.prospectService.getAllProspects().subscribe({
      next: (data :ProspectResponseDto[]) => {
        this.prospects.next(data);
        this.dataSource.data = data;
        this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
          // Customize filter logic for specific columns
          return data.name.toLowerCase().includes(filter) ||
            data.email.toLowerCase().includes(filter) ||
            data.industry.name.toLowerCase().includes(filter) ||
            data.phone.toLowerCase().includes(filter);
        };
      },
      error: (err) => {
        console.error('Error fetching prospects:', err);
      },
    });
  }

  ngAfterViewInit(): void {
    // Bind paginator and sort after view initialization
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  filterByStatus(status: string): void {
    console.log('Selected status:', status); // Debugging: Check the selected status
    if (status) {
      const filteredData = this.prospects.value.filter(
          prospect => prospect.prospectStatus === status
      );
      console.log('Filtered data:', filteredData); // Debugging: Check the filtered data
      this.dataSource.data = filteredData;
    } else {
      this.dataSource.data = this.prospects.value; // Reset to full list if no status is selected
    }

    // Reset paginator to the first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * This function allows to filter data in table
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
   * This function allows to open dialog to add new prospect
   */
  openAddProspectDialog(): void {
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      maxWidth: '900px',
      maxHeight:'100vh'
    });

    dialogRef.afterClosed().pipe(
      tap(response => {
        if (response) {
          // Check if the item already exists in the data source based on the ID
          const existingItemIndex = this.dataSource.data.findIndex(item => item.id === response.id);
          console.log("message " ,existingItemIndex)
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
      })
    ).subscribe();

  }

  /**
   * This function allows to edit prospect
   * @param row
   */
  editProspect(row: any): void {
    // Open dialog for editing the prospect
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      maxWidth: '900px',
      data: { ...row }  // Pass the prospect data to the dialog for editing
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
   * This function allows to delete prospect
   * @param row
   */
  deleteProspect(row: any): void {
    // Ask for confirmation before deleting
    const confirmation = confirm('Are you sure you want to delete this prospect?');
    if (confirmation) {
      // Remove the prospect from the dataSource
      const index = this.dataSource.data.findIndex(p => p.id === row.id);
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);  // Remove from dataSource array
        this.snackBar.open('Prospect deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    }
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
      this.prospectService.uploadFile(this.selectedFile).pipe(tap(data => {
        this.dataSource.data = [...this.dataSource.data, ...data];
        this.paginator.firstPage();
      })).subscribe()
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

  protected readonly ProspectStatus = ProspectStatus;
}
