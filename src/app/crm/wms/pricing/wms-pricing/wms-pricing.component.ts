import {AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';


import {Router} from "@angular/router";
import {combineLatest, EMPTY, map} from 'rxjs';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {BehaviorSubject, catchError, filter, Observable, Observer, of, tap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {FormControl} from "@angular/forms";
import {InteractionResponseDto} from '../../../../../dtos/response/interaction.response.dto';
import {InteractionService} from '../../../../../services/Leads/interaction.service';
import {CrmTypeEnum} from '../../../../../enums/crm/crm.type.enum';
import {InterlocutorResDto} from '../../../../../dtos/response/interlocutor.dto';
import {AddWmsPricingComponent} from '../add-wms-pricing/add-wms-pricing.component';
import {ProvisionService} from '../../../../../services/crm/wms/provision.service.dto';
import {RequirementService} from '../../../../../services/crm/wms/requirement.service';
import {UnloadingTypeService} from '../../../../../services/crm/wms/unloading.type.service';
import {UnloadingTypeResponseDto} from '../../../../../dtos/response/crm/unloading.type.response.dto';
import {ProvisionResponseDto} from '../../../../../dtos/response/crm/provision.response.dto';
import {RequirementResponseDto} from '../../../../../dtos/response/crm/requirement.response.dto';
import {LocalStorageService} from '../../../../../services/local.storage.service';
import {ProvisionRequestDto} from '../../../../../dtos/init_data/request/provision.request.dto';
import {UnloadingRequestDto} from '../../../../../dtos/init_data/request/unloading.request.dto';
import {RequirementRequestDto} from '../../../../../dtos/init_data/request/requirment.request.dto';

export interface ExampleTab {
  label: string;
  content: string;
  icon:string;
  data:MatTableDataSource<any>,
  type:string
}

@Component({
  selector: 'app-wms-pricing',
  standalone: true,
  imports: [
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
    AsyncPipe,
    MatTabLabel,
    MatMenuTrigger,
    NgIf
  ],
  templateUrl: './wms-pricing.component.html',
  styleUrl: './wms-pricing.component.css'
})

export class WmsPricingComponent implements OnInit, AfterViewInit{
  unloadingTypes: BehaviorSubject<UnloadingTypeResponseDto[]> =  new BehaviorSubject<UnloadingTypeResponseDto[]>([])
  provisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  requirements: BehaviorSubject<RequirementResponseDto[]> =  new BehaviorSubject<RequirementResponseDto[]>([])
  displayedColumns: string[] = [ 'name',"unite","price", "order","actions"];
  dataSource: MatTableDataSource<InteractionResponseDto> = new MatTableDataSource();
  asyncTabs!: Observable<ExampleTab[]>;
  selectedRows: Set<number> = new Set();
  isAllSelected = false;

  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sorts!: QueryList<MatSort>;



  constructor(private cdr: ChangeDetectorRef, private snackBar: MatSnackBar, protected router: Router,
              private dialog: MatDialog, private provisionService: ProvisionService, private localStorageService: LocalStorageService,
              private requirementService: RequirementService, private unloadingTypeService: UnloadingTypeService){
    // this.loadData();
  }

  loadData(): void {
    this.asyncTabs = combineLatest([
      this.unloadingTypes,
      this.requirements,
      this.provisions
    ]).pipe(
      map(([unloading, requirements, provisions]) => [
        {
          label: 'Dépotages',
          content: 'Content 1',
          icon: 'local_shipping',
          data: new MatTableDataSource(unloading),
          type: 'unloading'
        },
        {
          label: 'Exigences',
          content: 'Content 2',
          icon: 'list_alt',
          data: new MatTableDataSource(requirements),
          type: 'requirements'
        },
        {
          label: 'Préstations',
          content: 'Content 3',
          icon: 'receipt',
          data: new MatTableDataSource(provisions),
          type: 'provisions'
        }
      ])
    );
  }

  ngOnInit(){
    this.loadProvisions()
    this.loadUnloadingTypes()
    this.loadRequirements()
    this.loadData();
  }

  ngAfterViewInit() {
    this.asyncTabs.subscribe(tabs => {
      setTimeout(() => {
        tabs.forEach((tab, index) => {
          tab.data.paginator = this.paginators.toArray()[index];
          tab.data.sort = this.sorts.toArray()[index];
        });
      });
    });
  }

  /**
   *
   */
  loadProvisions(): void{
    this.provisionService.getAllProvisionsByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(data => {
        this.provisions.next(data.sort((a,b) => a.order - b.order)); // Perform the side effect of updating provisions
      }),
      catchError(err => {
        console.error(err); // Log the error
        return of([]); // Return an empty array in case of an error
      })
    ).subscribe();
  }

  /**
   *
   */
  loadUnloadingTypes(): void{
    // get unloading types and fill the select box by pushing data in unloading variable
    this.unloadingTypeService.getUnloadingTypeByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(unloadingTypes => {
        this.unloadingTypes.next(unloadingTypes.sort((a,b) => a.order - b.order))
      })
    ).subscribe()
  }
  /**
   *
   */
  loadRequirements(){
    this.requirementService.getRequirementsByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(data => {
        this.requirements.next(data.sort((a,b) => a.order - b.order));
      })).subscribe()
  }

  applyFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dataSource.filter = filterValue;
  }


  /**
   * This function allows to open dialog to add new pricing
   */
  openAddNewPricing(type:string): void {
    const dialogRef = this.dialog.open(AddWmsPricingComponent, {
      width: '1000px',
      maxHeight: '100vh',
      data:{
        type: type,
        object: {}
      }, // Pass the interlocutor if provided
    });

    dialogRef.afterClosed().pipe(
        // filter(response => !!response), // Proceed only if response is not null/undefined
        tap(response => {
          switch (type) {
            case 'unloading':
              this.loadUnloadingTypes();
              break;
            case 'requirements':
              this.loadRequirements();
              break;
            case 'provisions':
              this.loadData();
              this.loadProvisions();
              break;
            default:
              this.snackBar.open("Erreur","Close", {duration: 3000,})
          }
        })
    ).subscribe({
      complete:()=>{
        this.loadData();
      }
    });
  }

  toggleRowSelection(rowId: number): void {
    if (this.selectedRows.has(rowId)) {
      this.selectedRows.delete(rowId);
    } else {
      this.selectedRows.add(rowId);
    }
    // this.checkIfAllSelected();
  }

  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.selectedRows.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selectedRows.add(row.id));
    }
    this.isAllSelected = !this.isAllSelected;
  }

  // checkIfAllSelected(): void {
  //   this.isAllSelected = this.dataSource.data.every((row) => this.selectedRows.has(row.id));
  // }

  isRowSelected(rowId: number): boolean {
    return this.selectedRows.has(rowId);
  }

  showDetails(row: ProvisionRequestDto | UnloadingRequestDto | RequirementRequestDto, type:string): void {
    const dialogRef = this.dialog.open(AddWmsPricingComponent, {
      width: '1000px',
      maxHeight: '100vh',
      data: {
        type: type,
        object: row
      },
    });

    dialogRef.afterClosed().pipe(
      // filter(response => !!response), // Proceed only if response is not null/undefined
      tap(response => {
        switch (type) {
          case 'unloading':
            this.loadUnloadingTypes();
            break;
          case 'requirements':
            this.loadRequirements();
            break;
          case 'provisions':
            this.loadData();
            this.loadProvisions();
            break;
          default:
            this.snackBar.open("Erreur","Close", {duration: 3000,})
        }
      })
    ).subscribe({
      complete:()=>{
        this.loadData();
      }
    });
  }

  /**
   * This function allows marking a Provision as storage price.
   * @param row - The provision to update.
   */
  markProvisionAsStoragePrice(row: ProvisionResponseDto) {
    this.provisionService.markProvisionAsStoragePrice(row.id).subscribe({
      next: () => {
        this.snackBar.open("La mise à jour a été effectuée avec succès", "OK", { duration: 3000 });
      },
      error: () => {
        this.snackBar.open("Erreur lors de la mise à jour", "OK", { duration: 3000 });
        return EMPTY;
      }
    });
  }

}
