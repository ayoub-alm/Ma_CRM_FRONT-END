import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf, AsyncPipe } from '@angular/common';
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
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StorageNeedService } from '../../../../services/crm/wms/storage.need.service';
import { LocalStorageService } from '../../../../services/local.storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CrmTypeEnum } from '../../../../enums/crm/crm.type.enum';
import { getLabelFromStorageReasonEnum, StorageReasonEnum } from '../../../../enums/crm/storage.reason.enum';
import { StorageOfferResponseDto } from '../../../../dtos/response/crm/storage.offer.response.dto';
import { StorageOfferService } from '../../../../services/crm/wms/storage.offer.service';
import { LoadingService } from '../../../../services/loading.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputTextModule } from 'primeng/inputtext';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProspectService } from '../../../../services/Leads/prospect.service';
import { ProspectResponseDto } from '../../../../dtos/response/prospect.response.dto';

@Component({
  selector: 'app-wms-offer',
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
    MatProgressSpinnerModule,
    NgIf,
    NgClass,
    InputTextModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    MatDatepickerModule,
    AsyncPipe
  ],
  templateUrl: './wms-offer.component.html',
  styleUrl: './wms-offer.component.css',
  providers: [provideNativeDateAdapter()]
})
export class WmsOfferComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'ref', 'customer', 'status', 'productType',
    'date', 'storageReason', 'stockedItem', 'actions'];

  storageOffers: MatTableDataSource<StorageOfferResponseDto> = new MatTableDataSource();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loading$!: Observable<boolean>;
  crmType = new FormControl('');
  isFiltersVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fieldFilterForm!: FormGroup;
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);

  constructor(
    private storageOfferService: StorageOfferService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    protected router: Router,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private prospectService: ProspectService
  ) {
    this.fieldFilterForm = fb.group({
      customerIds: [[]],
      productType: [''],
      storageReason: [''],
      createdAtStart: [null],
      createdAtEnd: [null],
      filterType: ['OR']
    });
  }

  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$;
    this.setupFilterPredicate();
    this.loadNeedBasedOnSelectedType();
    this.loadFilterData();
  }

  loadFilterData(): void {
    const companyId = this.localStorageService.getCurrentCompanyId();
    this.prospectService.getAllCustomers(companyId).pipe(
      tap(customers => this.customers.next(customers))
    ).subscribe();
  }

  toggleFilters(): void {
    setTimeout(() => {
      this.isFiltersVisible.next(!this.isFiltersVisible.getValue());
    }, 0);
  }

  resetFilters(): void {
    this.fieldFilterForm.reset({ filterType: 'OR' });
    this.storageOffers.filter = '';
  }

  ngAfterViewInit(): void {
    this.storageOffers.paginator = this.paginator;
    this.storageOffers.sort = this.sort;
  }

  setupFilterPredicate(): void {
    this.storageOffers.filterPredicate = (data: StorageOfferResponseDto, filter: string) => {
      const searchTerms = filter.toLowerCase();
      const ref = data.number?.toLowerCase() || '';
      const customer = data.customer?.name?.toLowerCase() || '';
      const productType = data.productType?.toLowerCase() || '';
      const status = data.status?.name?.toLowerCase() || '';
      const reason = data.storageReason ? getLabelFromStorageReasonEnum(data.storageReason!)?.toLowerCase() || '' : '';
      const items = data.stockedItems?.map(item =>
        `${item.supportName} ${item.structureName} ${item.temperatureName} `.toLowerCase()
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
    switch (this.crmType.value) {
      case CrmTypeEnum.WMS:

        break;
      case CrmTypeEnum.TMS:
        this.router.navigateByUrl('/admin/crm/need/tms/show').then(r => { return; });
        break;
      case CrmTypeEnum.TMSI:
        this.router.navigateByUrl('/admin/crm/need/show').then(r => { return; });
        break;
    }
    const selectedCompanyId = parseInt(this.localStorageService.getItem("selected_company_id"));
    this.storageOfferService.getAllStorageOffersByCompanyId(selectedCompanyId).subscribe({
      next: (data) => {
        this.storageOffers.data = data.sort((a, b) => b.id - a.id);
      },
      error: (err) => {
        console.error('Error loading interactions:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    this.storageOffers.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.storageOffers.paginator) {
      this.storageOffers.paginator.firstPage();
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
      this.storageOffers.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  checkIfAllSelected(): void {
    this.isAllSelected = this.storageOffers.data.every((row) => this.selectedRows.has(row.id));
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

  showOfferDetails(need: StorageOfferResponseDto): void {
    this.router.navigateByUrl("/admin/crm/wms/offers/show/" + need.id).then(r => { })
  }

  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;


  getStatusColor(statusId: number | undefined): string {
    switch (statusId) {
      case 1: return 'bg-info-subtle text-dark';
      case 2: return 'bg-warning-subtle text-dark';
      case 3: return 'bg-success-subtle  text-dark';
      default: return 'bg-secondary-subtle text-dark';
    }
  }

}
