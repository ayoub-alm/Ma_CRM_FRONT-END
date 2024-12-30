import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {DatePipe, NgIf} from '@angular/common';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {LocalStorageService} from '../../../services/local.storage.service';
import {AuthService} from '../../../services/AuthService';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-need',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatIcon,
    NgIf,
    RouterLink,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIconButton,
    MatInput,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatNoDataRow,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    RouterOutlet
  ],
  templateUrl: './need.component.html',
  styleUrl: './need.component.css'
})
export class NeedComponent implements OnInit, OnDestroy{
  subscriptions: Subscription[] = [];
  crmType = new FormControl('');
  constructor(private authService: AuthService,private localStorageService: LocalStorageService, private router: Router) {
  }
  ngOnInit(): void {
    this.crmType.setValue(this.localStorageService.getItem("current_crm"))
    this.router.navigateByUrl('/admin/crm/need/'+this.localStorageService.getItem("current_crm").toLowerCase()).then((data => {return}));
     this.subscriptions.push(
       this.crmType.valueChanges.subscribe(data => {
       this.localStorageService.setItem("current_crm", data);
       this.router.navigateByUrl('/admin/crm/need/'+this.localStorageService.getItem("current_crm").toLowerCase()).then((data => {return}));
     }))
  }

  /**
   * unsubscript from
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
