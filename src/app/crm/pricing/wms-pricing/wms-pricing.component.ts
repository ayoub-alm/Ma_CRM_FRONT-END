import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InteractionResponseDto} from "../../../../dtos/response/interaction.response.dto";
import {CrmTypeEnum} from "../../../../enums/crm/crm.type.enum";
import {Router} from "@angular/router";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {filter, Observable, Observer, tap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AddWmsPricingComponent} from "./add-wms-pricing/add-wms-pricing.component";
import {InterlocutorResDto} from "../../../../dtos/response/interlocutor.dto";
import {InteractionService} from "../../../../services/Leads/interaction.service";
import {FormControl} from "@angular/forms";

export interface ExampleTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-wms-pricing',
  standalone: true,
  imports: [
    DatePipe,
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
    MatHeaderCellDef,
    MatNoDataRow,
    MatTabGroup,
    MatTab,
    AsyncPipe
  ],
  templateUrl: './wms-pricing.component.html',
  styleUrl: './wms-pricing.component.css'
})
export class WmsPricingComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['select', 'prospectName', 'interlocutorName', 'interactionSubject', 'interactionType',
    'planningDate', 'affectedTo', 'actions'];

  dataSource: MatTableDataSource<InteractionResponseDto> = new MatTableDataSource();
  asyncTabs: Observable<ExampleTab[]>;
  selectedRows: Set<number> = new Set();
  isAllSelected = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  crmType = new FormControl('');


  constructor(private interactionService: InteractionService, private snackBar: MatSnackBar, private router: Router, private dialog: MatDialog){
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      setTimeout(() => {
        observer.next([
          {label: 'Depotage', content: 'Content 1'},
          {label: 'Requirement', content: 'Content 2'},
          {label: 'Provision', content: 'Content 3'},
          {label: 'Management fees', content: 'Content 4'},
          {label: 'Insurance', content: 'Content 5'},
        ]);
      }, 1000);
    });
  }

  ngOnInit(){
    this.loadNeedBasedOnSelectedType();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator ;
    this.dataSource.sort = this.sort;
  }

  loadNeedBasedOnSelectedType(): void {
    switch (this.crmType.value) {
      case CrmTypeEnum.WMS:

        break;
      case CrmTypeEnum.TMS:
        this.router.navigateByUrl('/admin/crm/need/tms/show').then(r => {return;});
        break;
      case CrmTypeEnum.TMSI:
        this.router.navigateByUrl('/admin/crm/need/show').then(r => {return;});
        break;
    }
    this.interactionService.getAllInteractions().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error loading interactions:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  /**
   * This function allows to open dialog to add new interlocutor
   */
  openAddInterlocutor(interlocutor?: InterlocutorResDto): void {
    const dialogRef = this.dialog.open(AddWmsPricingComponent, {
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
      this.selectedRows.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  checkIfAllSelected(): void {
    this.isAllSelected = this.dataSource.data.every((row) => this.selectedRows.has(row.id));
  }

  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }

  showDetails(row: InteractionResponseDto): void {
    alert(localStorage.getItem('current_crm'))
    switch (localStorage.getItem('current_crm')) {
      case CrmTypeEnum.WMS:
        this.router.navigateByUrl('/admin/crm/pricing/wms/show').then(r => {return;});
        break;
      case CrmTypeEnum.TMS:
        this.router.navigateByUrl('/admin/crm/pricing/tms/show').then(r => {return;});
        break;
      case CrmTypeEnum.TMSI:
        this.router.navigateByUrl('/admin/crm/pricing/show').then(r => {return;});
        break;
      default:
        this.snackBar.open("Error", "OK", {
          duration:2000
        })
    }
  }

}
