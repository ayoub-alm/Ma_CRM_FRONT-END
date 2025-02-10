import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';


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

export interface ExampleTab {
  label: string;
  content: string;
  icon:string;
  data:any
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
    AsyncPipe,
    MatTabLabel
  ],
  templateUrl: './wms-pricing.component.html',
  styleUrl: './wms-pricing.component.css'
})
export class WmsPricingComponent implements OnInit, AfterViewInit{
  unloadingTypes: BehaviorSubject<UnloadingTypeResponseDto[]> =  new BehaviorSubject<UnloadingTypeResponseDto[]>([])
  selectedUnloadingTypes:  BehaviorSubject<UnloadingTypeResponseDto[]> =  new BehaviorSubject<UnloadingTypeResponseDto[]>([])
  unloadingDisplayedColumns: string[] = [ 'name',"unite","price", "actions"];
  unloadingDataSource: BehaviorSubject<UnloadingTypeResponseDto[]> = new BehaviorSubject<UnloadingTypeResponseDto[]>([]);
  // provisions infos
  provisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  selectedProvisions: BehaviorSubject<ProvisionResponseDto[]> =  new BehaviorSubject<ProvisionResponseDto[]>([])
  provisionsDisplayedColumns: string[] =[ 'name',"unite","price", "actions"];
  // requirements infos
  requirements: BehaviorSubject<RequirementResponseDto[]> =  new BehaviorSubject<RequirementResponseDto[]>([])
  selectedRequirements: BehaviorSubject<RequirementResponseDto[]> =  new BehaviorSubject<RequirementResponseDto[]>([])
  requirementsColumns: string[] = [ 'name', "unite", "actions"];
  displayedColumns: string[] = [ 'name',"unite","price", "actions"];

  dataSource: MatTableDataSource<InteractionResponseDto> = new MatTableDataSource();
  asyncTabs: Observable<ExampleTab[]>;
  selectedRows: Set<number> = new Set();
  isAllSelected = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  crmType = new FormControl('');


  constructor(private interactionService: InteractionService, private snackBar: MatSnackBar, protected router: Router,
              private dialog: MatDialog, private provisionService: ProvisionService, private localStorageService: LocalStorageService,
              private requirementService: RequirementService, private unloadingTypeService: UnloadingTypeService){
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      setTimeout(() => {
        observer.next([
          { label: 'Dépotage', content: 'Content 1', icon: 'local_shipping', data: this.unloadingTypes},
          { label: 'Exigences', content: 'Content 2', icon: 'list_alt' ,data:this.requirements},
          { label: 'Préstations', content: 'Content 3', icon: 'receipt',data:this.provisions },
          // { label: 'Management fees', content: 'Content 4', icon: 'money' },
          // { label: 'Insurance', content: 'Content 5', icon: 'security' }
        ]);
      }, 1000);
    });
  }

  ngOnInit(){
    this.loadNeedBasedOnSelectedType();
    this.loadProvisions()
    this.loadUnloadingTypes()
    this.loadRequirements()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator ;
    this.dataSource.sort = this.sort;
  }

  /**
   *
   */
  loadProvisions(): void{
    this.provisionService.getAllProvisionsByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(data => {
        this.provisions.next(data); // Perform the side effect of updating provisions
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
        this.unloadingTypes.next(unloadingTypes)
      })
    ).subscribe()
  }
  /**
   *
   */
  loadRequirements(){
    this.requirementService.getRequirementsByCompanyId(this.localStorageService.getItem("selected_company_id")).pipe(
      tap(data => {
        this.requirements.next(data);
      })).subscribe()
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
      width: '1000px',
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
