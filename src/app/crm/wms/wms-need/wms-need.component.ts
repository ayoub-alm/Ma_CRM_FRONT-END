import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgForOf, NgIf, AsyncPipe } from '@angular/common';
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
import { InteractionResponseDto } from '../../../../dtos/response/interaction.response.dto';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InteractionService } from '../../../../services/Leads/interaction.service';
import { LocalStorageService } from '../../../../services/local.storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CrmTypeEnum } from '../../../../enums/crm/crm.type.enum';
import {
  AddEditInteractionDialogComponent
} from '../../../admin/interaction/add-edit-interaction-dialog/add-edit-interaction-dialog.component';
import { WmsNeedCreatEditComponent } from './wms-need-creat-edit/wms-need-creat-edit.component';
import { InputTextModule } from 'primeng/inputtext';
import { StorageNeedResponseDto } from '../../../../dtos/response/crm/storage.need.response.dto';
import { StorageNeedService } from '../../../../services/crm/wms/storage.need.service';
import { LivreEnum } from '../../../../enums/crm/livre.enum';
import { getLabelFromStorageReasonEnum, StorageReasonEnum } from '../../../../enums/crm/storage.reason.enum';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { WmsNeedCreateComponent } from './wms-need-create/wms-need-create.component';
import { BehaviorSubject, tap } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProspectService } from '../../../../services/Leads/prospect.service';
import { ProspectResponseDto } from '../../../../dtos/response/prospect.response.dto';


@Component({
  selector: 'app-wms-need',
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
    MatNoDataRow,
    MatHeaderCellDef,
    MatMenuTrigger,
    InputTextModule,
    NgForOf,
    NgIf,
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
  templateUrl: './wms-need.component.html',
  styleUrl: './wms-need.component.css',
  providers: [provideNativeDateAdapter()],
})
export class WmsNeedComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'ref', 'customer', 'status', 'productType',
    'date', 'storageReason', 'stockedItem', 'actions'];

  dataSource: MatTableDataSource<StorageNeedResponseDto> = new MatTableDataSource();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  crmType = new FormControl('');
  isFiltersVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fieldFilterForm!: FormGroup;
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);

  constructor(
    private storageNeedService: StorageNeedService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    protected router: Router,
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
    this.dataSource.filter = '';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: StorageNeedResponseDto, filter: string) => {
      const searchTerms = filter.toLowerCase();
      const ref = data.number?.toLowerCase() || '';
      const customer = data.customer?.name?.toLowerCase() || '';
      const productType = data.productType?.toLowerCase() || '';
      const status = data.status?.name?.toLowerCase() || '';
      const reason = data.storageReason ? getLabelFromStorageReasonEnum(data.storageReason!)?.toLowerCase() || '' : '';
      const items = data.stockedItems?.map(item =>
        `${item.supportName} ${item.structureName} ${item.temperatureName}`.toLowerCase()
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
    this.storageNeedService.getAllStorageNeedsByCompanyId(selectedCompanyId).subscribe({
      next: (data) => {
        this.dataSource.data = data.sort((a, b) => b.id - a.id);
      },
      error: (err) => {
        console.error('Error loading interactions:', err);
      },
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  createEditWmsNeed(): void {
    // this.router.navigateByUrl('/admin/crm/wms/needs/create').then(value => {return;});
    const dialogRef = this.dialog.open(WmsNeedCreateComponent, {
      maxWidth: '50vw', maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe({
      next: (storageNeed) => {
        this.loadNeedBasedOnSelectedType();
      }
    })
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

  showNeedDetails(need: StorageNeedResponseDto): void {
    this.router.navigateByUrl("/admin/crm/wms/needs/show/" + need.id).then(r => { })
  }
  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;
}
