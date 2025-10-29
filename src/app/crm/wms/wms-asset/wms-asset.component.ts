import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
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
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {StorageDeliveryNoteResponseDto} from '../../../../dtos/response/crm/storage.delivery.note.response.dto';
import {BehaviorSubject, tap} from 'rxjs';
import {ProspectResponseDto} from '../../../../dtos/response/prospect.response.dto';
import {ProspectService} from '../../../../services/Leads/prospect.service';
import {LocalStorageService} from '../../../../services/local.storage.service';
import {Router} from '@angular/router';
import {StorageDeliveryNoteService} from '../../../../services/crm/wms/storage.delivery.note.service';
import {getLabelFromStorageReasonEnum} from '../../../../enums/crm/storage.reason.enum';
import {TranslatePipe} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateCreditNoteComponent} from './create-credit-note/create-credit-note.component';
import {StorageCreditNoteResponseDto} from '../../../../dtos/response/crm/storage.credit.note.response.dto';
import {StorageCreditNoteService} from '../../../../services/crm/wms/storage.credit.note.service';

@Component({
  selector: 'app-wms-asset',
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
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatButton, MatIcon, MatMenu, MatMenuTrigger, MatIconButton,
    MatInput, DatePipe, MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
    MatHeaderRow, MatHeaderRowDef, MatPaginator, MatRow, MatRowDef,
    MatSort, MatSortHeader, MatTable, MatNoDataRow, MatHeaderCellDef, TranslatePipe
  ],
  templateUrl: './wms-asset.component.html',
  styleUrl: './wms-asset.component.css'
})
export class WmsAssetComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'status','ref', 'customer', 'invoice', 'date','totalHt','createdBy', 'actions'];

  storageCreditNotes: MatTableDataSource<StorageCreditNoteResponseDto> = new MatTableDataSource<StorageCreditNoteResponseDto>();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);

  constructor(private customersService: ProspectService, private localStorageService: LocalStorageService,
              public router: Router, private storageCreditNoteService: StorageCreditNoteService,
              private dialog: MatDialog) { }

  ngOnInit() {
    const companyId = this.localStorageService.getCurrentCompanyId();

    this.customersService.getAllCustomers(companyId).pipe(
      tap(customers => {
        this.customers.next(customers);
      })
    ).subscribe();

    this.loadStoragesCreditNotes();
  }

  ngAfterViewInit() {
    this.storageCreditNotes.paginator = this.paginator;
    this.storageCreditNotes.sort = this.sort;
  }

  /**
   *
   */
  loadStoragesCreditNotes(){
    const companyId = this.localStorageService.getCurrentCompanyId();
    this.storageCreditNoteService.getAllStorageCreditNoteByCompanyId(companyId).pipe(
      tap(storageCreditNotes => {
        this.storageCreditNotes.data = storageCreditNotes.sort((a, b) => b.id - a.id);
      })
    ).subscribe();
  }

  /**
   *
   */
  onCreateStorageCreditNote(): void {
    const dialogRef = this.dialog.open(CreateCreditNoteComponent, {
      width: '1000px',
      maxHeight: '100vh',
      data:{}
    })
    // close the dialog and update the data in the tables
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.loadStoragesCreditNotes();
      }
    })
  }

  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;

  /**
   *
   * @param row
   */
  showBLDetails(row: any): void {
    this.router.navigateByUrl(`/admin/crm/wms/credit-notes/show/${row.id}`).then()
  }

  applyFilter(event: Event): void {
    this.storageCreditNotes.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
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
      this.storageCreditNotes.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  checkIfAllSelected(): void {
    this.isAllSelected = this.storageCreditNotes.data.every((row) => this.selectedRows.has(row.id));
  }

  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }
}
