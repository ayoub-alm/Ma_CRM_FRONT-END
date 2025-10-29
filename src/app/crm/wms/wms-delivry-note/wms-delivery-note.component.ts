import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ProspectResponseDto } from '../../../../dtos/response/prospect.response.dto';
import { ProspectService } from '../../../../services/Leads/prospect.service';
import { LocalStorageService } from '../../../../services/local.storage.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { DatePipe, NgForOf } from '@angular/common';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { getLabelFromStorageReasonEnum } from '../../../../enums/crm/storage.reason.enum';
import { StorageDeliveryNoteService } from '../../../../services/crm/wms/storage.delivery.note.service';
import { StorageDeliveryNoteResponseDto } from '../../../../dtos/response/crm/storage.delivery.note.response.dto';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-wms-delivry-note',
  standalone: true,
  imports: [
    MatButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, MatIconButton,
    MatInput, DatePipe, MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
    MatHeaderRow, MatHeaderRowDef, MatPaginator, MatRow, MatRowDef,
    MatSort, MatSortHeader, MatTable, MatNoDataRow, MatHeaderCellDef, TranslatePipe
  ],
  templateUrl: './wms-delivery-note.component.html',
  styleUrl: './wms-delivery-note.component.css'
})
export class WmsDeliveryNoteComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'ref', 'customer', 'status', 'contract', 'date', 'actions'];

  storageDeliveryNotes: MatTableDataSource<StorageDeliveryNoteResponseDto> = new MatTableDataSource<StorageDeliveryNoteResponseDto>();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);

  constructor(
    private customersService: ProspectService,
    private localStorageService: LocalStorageService,
    public router: Router,
    private storageDeliveryNoteService: StorageDeliveryNoteService
  ) { }

  ngOnInit() {
    const companyId = this.localStorageService.getCurrentCompanyId();

    this.customersService.getAllCustomers(companyId).pipe(
      tap(customers => {
        this.customers.next(customers);
      })
    ).subscribe();

    this.storageDeliveryNoteService.getAllStorageDeliveryNoteByCompanyId(companyId).pipe(
      tap(storageDeliveryNotes => {
        this.storageDeliveryNotes.data = storageDeliveryNotes.sort((a, b) => b.id - a.id);
        console.log(this.storageDeliveryNotes.data);
      })
    ).subscribe();
  }
  ngAfterViewInit() {
    this.storageDeliveryNotes.paginator = this.paginator;
    this.storageDeliveryNotes.sort = this.sort;
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
    this.router.navigateByUrl(`/admin/crm/wms/delivery-note/show/${row.id}`)
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.storageDeliveryNotes.filter = filterValue;
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
      this.storageDeliveryNotes.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  checkIfAllSelected(): void {
    this.isAllSelected = this.storageDeliveryNotes.data.every((row) => this.selectedRows.has(row.id));
  }

  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }
}
