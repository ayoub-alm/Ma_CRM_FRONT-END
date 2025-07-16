import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
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
import {MatInput} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {StorageDeliveryNoteResponseDto} from '../../../../dtos/response/crm/storage.delivery.note.response.dto';
import {BehaviorSubject, tap} from 'rxjs';
import {ProspectResponseDto} from '../../../../dtos/response/prospect.response.dto';
import {ProspectService} from '../../../../services/Leads/prospect.service';
import {LocalStorageService} from '../../../../services/local.storage.service';
import {Router} from '@angular/router';
import {StorageDeliveryNoteService} from '../../../../services/crm/wms/storage.delivery.note.service';
import { getLabelFromStorageReasonEnum } from '../../../../enums/crm/storage.reason.enum';
import {StorageInvoiceService} from '../../../../services/crm/wms/storage.invoice.service';
import {StorageInvoiceResponseDto} from '../../../../dtos/response/crm/storage.invoice.response.dto';

@Component({
  selector: 'app-wms-invoice',
  standalone: true,
  imports: [
    MatButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, MatIconButton,
    MatInput, DatePipe, MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
    MatHeaderRow, MatHeaderRowDef, MatPaginator, MatRow, MatRowDef,
    MatSort, MatSortHeader, MatTable, MatNoDataRow, MatHeaderCellDef
  ],
  templateUrl: './wms-invoice.component.html',
  styleUrl: './wms-invoice.component.css'
})
export class WmsInvoiceComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'ref', 'customer', 'status', 'contract', 'date', 'actions'];

  storageInvoices: MatTableDataSource<StorageInvoiceResponseDto> = new MatTableDataSource<StorageInvoiceResponseDto>();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);

  constructor(
    private customersService: ProspectService,
    private localStorageService: LocalStorageService,
    public router: Router,
    private storageDeliveryNoteService: StorageDeliveryNoteService,
    private storageInvoiceService: StorageInvoiceService,
  ) { }

  ngOnInit() {
    const companyId = this.localStorageService.getCurrentCompanyId();

    this.storageInvoiceService.getAllStorageInvoicesByCompanyId(companyId).pipe(
      tap(storageDeliveryNotes => {
        this.storageInvoices.data = storageDeliveryNotes.sort((a, b) => b.id - a.id);
      })
    ).subscribe();

  }

  ngAfterViewInit() {
    this.storageInvoices.paginator = this.paginator;
    this.storageInvoices.sort = this.sort;
  }

  /**
   *
   */
  onCreateDeliveryNote(): void {
    this.router.navigateByUrl('/admin/crm/wms/delivery-note/create');
  }

  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;

  /**
   *
   * @param row
   */
  showBLDetails(row: any): void {
    this.router.navigateByUrl(`/admin/crm/wms/invoice/show/${row.id}`)
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.storageInvoices.filter = filterValue;
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
      this.storageInvoices.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  checkIfAllSelected(): void {
    this.isAllSelected = this.storageInvoices.data.every((row) => this.selectedRows.has(row.id));
  }

  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }
}
