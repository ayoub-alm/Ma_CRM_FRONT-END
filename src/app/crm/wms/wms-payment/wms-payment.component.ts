import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgForOf } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { TranslatePipe } from '@ngx-translate/core';
import { StorageCreditNoteResponseDto } from '../../../../dtos/response/crm/storage.credit.note.response.dto';
import { BehaviorSubject, tap } from 'rxjs';
import { ProspectResponseDto } from '../../../../dtos/response/prospect.response.dto';
import { ProspectService } from '../../../../services/Leads/prospect.service';
import { LocalStorageService } from '../../../../services/local.storage.service';
import { Router } from '@angular/router';
import { StorageCreditNoteService } from '../../../../services/crm/wms/storage.credit.note.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCreditNoteComponent } from '../wms-asset/create-credit-note/create-credit-note.component';
import { getLabelFromStorageReasonEnum } from '../../../../enums/crm/storage.reason.enum';
import { StorageInvoicePaymentResponseDto } from '../../../../dtos/response/crm/storage.invoice.payment.response.dto';
import { StorageInvoicePaymentService } from '../../../../services/crm/wms/storage.invoice.payment.service';

@Component({
  selector: 'app-wms-payment',
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
    TranslatePipe,
    MatMenuTrigger,
    MatHeaderCellDef,
    MatNoDataRow,
    NgForOf
  ],
  templateUrl: './wms-payment.component.html',
  styleUrl: './wms-payment.component.css'
})
export class WmsPaymentComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'ref', 'invoice', 'date', 'amount', 'createdBy', 'actions'];

  storageInvoicePayments: MatTableDataSource<StorageInvoicePaymentResponseDto> = new MatTableDataSource<StorageInvoicePaymentResponseDto>();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);

  constructor(private customersService: ProspectService, private localStorageService: LocalStorageService,
    public router: Router, private storagePaymentService: StorageInvoicePaymentService,
    private dialog: MatDialog) { }

  ngOnInit() {
    const companyId = this.localStorageService.getCurrentCompanyId();

    this.customersService.getAllCustomers(companyId).pipe(
      tap(customers => {
        this.customers.next(customers);
      })
    ).subscribe();

    this.setupFilterPredicate();

  }

  ngAfterViewInit() {
    this.loadStoragesPayments();
    this.storageInvoicePayments.paginator = this.paginator;
    this.storageInvoicePayments.sort = this.sort;
  }

  setupFilterPredicate(): void {
    this.storageInvoicePayments.filterPredicate = (data: StorageInvoicePaymentResponseDto, filter: string) => {
      const searchTerms = filter.toLowerCase();
      const ref = (data.ref || '').toLowerCase();
      const createdBy = (data.createdBy?.name || '').toLowerCase();
      const amount = (data.amount || '').toString().toLowerCase();
      const invoices = data.storageInvoices?.map(inv => inv.number.toLowerCase()).join(' ') || '';

      return ref.includes(searchTerms) ||
        createdBy.includes(searchTerms) ||
        amount.includes(searchTerms) ||
        invoices.includes(searchTerms);
    };
  }

  /**
   *
   */
  loadStoragesPayments() {
    const companyId = this.localStorageService.getCurrentCompanyId();
    this.storagePaymentService.getAllStoragePaymentByCompanyId(companyId).pipe(
      tap(storageCreditNotes => {
        this.storageInvoicePayments.data = storageCreditNotes.sort((a, b) => b.id - a.id);
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
      data: {}
    })
    // close the dialog and update the data in the tables
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStoragesPayments();
      }
    })
  }

  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;

  /**
   *
   * @param row
   */
  showPaymentDetails(row: any): void {
    this.router.navigateByUrl(`/admin/crm/wms/payments/show/${row.id}`).then()
  }

  applyFilter(event: Event): void {
    this.storageInvoicePayments.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.storageInvoicePayments.paginator) {
      this.storageInvoicePayments.paginator.firstPage();
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
      this.selectedRows.clear();
    } else {
      this.storageInvoicePayments.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  checkIfAllSelected(): void {
    this.isAllSelected = this.storageInvoicePayments.data.every((row) => this.selectedRows.has(row.id));
  }

  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }
}
