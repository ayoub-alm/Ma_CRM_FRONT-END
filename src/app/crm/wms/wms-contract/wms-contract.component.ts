import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
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
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { StorageOfferResponseDto } from '../../../../dtos/response/crm/storage.offer.response.dto';
import { FormControl } from '@angular/forms';
import { StorageOfferService } from '../../../../services/crm/wms/storage.offer.service';
import { LocalStorageService } from '../../../../services/local.storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CrmTypeEnum } from '../../../../enums/crm/crm.type.enum';
import { StorageNeedResponseDto } from '../../../../dtos/response/crm/storage.need.response.dto';
import { getLabelFromStorageReasonEnum } from '../../../../enums/crm/storage.reason.enum';
import { StorageContractService } from '../../../../services/crm/wms/storage.contract.service';
import { StorageContractResponseDto } from '../../../../dtos/response/crm/storage.contract.response.dto';
import { Observable } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'app-wms-contract',
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
    NgForOf,
    MatMenuTrigger,
    MatHeaderCellDef,
    MatNoDataRow,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './wms-contract.component.html',
  styleUrl: './wms-contract.component.css'
})
export class WmsContractComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'ref', 'customer', 'status', 'productType',
    'date', 'storageReason', 'stockedItem', 'actions'];

  storageContratcs: MatTableDataSource<StorageContractResponseDto> = new MatTableDataSource();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  crmType = new FormControl('');
  loading$!: Observable<boolean>;
  constructor(private storageContractService: StorageContractService, private localStorageService: LocalStorageService, private dialog: MatDialog, private snackBar: MatSnackBar,
    protected router: Router, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$
    this.setupFilterPredicate();
    this.loadNeedBasedOnSelectedType();

  }

  ngAfterViewInit(): void {
    this.storageContratcs.paginator = this.paginator;
    this.storageContratcs.sort = this.sort;
  }

  setupFilterPredicate(): void {
    this.storageContratcs.filterPredicate = (data: StorageContractResponseDto, filter: string) => {
      const searchTerms = filter.toLowerCase();
      const ref = (data.number || '').toLowerCase();
      const customer = (data.customer?.name || '').toLowerCase();
      const productType = (data.productType || '').toLowerCase();
      const status = (data.status?.name || '').toLowerCase();
      const reason = data.storageReason ? getLabelFromStorageReasonEnum(data.storageReason!)?.toLowerCase() || '' : '';
      const items = data.stockedItems?.map(item =>
        `${item.supportName || ''} ${item.structureName || ''} ${item.temperatureName || ''}`.toLowerCase()
      ).join(' ') || '';

      return ref.includes(searchTerms) ||
        customer.includes(searchTerms) ||
        productType.includes(searchTerms) ||
        status.includes(searchTerms) ||
        reason.includes(searchTerms) ||
        items.includes(searchTerms);
    };
  }

  loadNeedBasedOnSelectedType(): void {
    const selectedCompanyId = parseInt(this.localStorageService.getItem("selected_company_id"));
    this.storageContractService.getAllStorageContractsByCompanyId(selectedCompanyId).subscribe({
      next: (data) => {
        this.storageContratcs.data = data.sort((a, b) => b.id - a.id);
      },
      error: (err) => {
        console.error('Error loading interactions:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    this.storageContratcs.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.storageContratcs.paginator) {
      this.storageContratcs.paginator.firstPage();
    }
  }

  createEditWmsNeed(): void {
    this.router.navigateByUrl('/admin/crm/wms/offers/create').then(value => { return; });

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
      this.storageContratcs.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  checkIfAllSelected(): void {
    this.isAllSelected = this.storageContratcs.data.every((row) => this.selectedRows.has(row.id));
  }

  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }


  getNeedStatus(status: string): string {
    switch (status) {
      case 'CREATION':
        return "Crée"
      default:
        return "N/A"
    }
  }


  getNeedReason(reason: string): string {
    switch (reason) {
      case 'OUTSOURCING':
        return ''
      default:
        return "N/A"
    }
  }

  showContractDetails(need: StorageNeedResponseDto): void {
    this.router.navigateByUrl("/admin/crm/wms/contracts/show/" + need.id).then(r => { })
  }

  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;


  /**
   * This function allows us to get the color of background of annexes and contracts
   * @param row
   */
  getRowBg(row: StorageContractResponseDto): string {
    if (row.parentContract) {
      return 'bg-spider-light text-secondary';
    } else {
      return 'bg-white text-secondary';
    }
  }
}
