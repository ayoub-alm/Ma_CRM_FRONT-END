import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DatePipe, NgForOf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell, MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef, MatNoDataRow,
    MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {Router, RouterLink} from "@angular/router";
import {UserModel} from "../../models/super-admin/user.model";
import {UserService} from "../../services/super-admin/user.service";
import {BehaviorSubject} from "rxjs";
import {UserResponseDto} from '../../dtos/response/super-admin-responseDtos/user.response.dto';
import {UserCreatEditComponent} from './user-creat-edit/user-creat-edit.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatDialogModule,
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
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    NgForOf,
    RouterLink,
    MatHeaderCellDef,
    MatNoDataRow,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit{

    displayedColumns: string[] = ['select', 'matricule', 'name', 'role', 'email', 'phone', 'status', 'actions'];
    dataSource: MatTableDataSource<UserResponseDto> = new MatTableDataSource();
    users: BehaviorSubject<UserResponseDto[]> = new BehaviorSubject<UserResponseDto[]>([]);
    isAllSelected = false;
    selectedRows: Set<number> = new Set();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private dialog: MatDialog, private userService: UserService, protected router: Router) {}

    ngOnInit() {
        // Fetch and populate Users data
        this.userService.getAllUsers().subscribe({
            next: (data: UserResponseDto[]) => {
                this.users.next(data);
                this.dataSource.data = data;
                this.dataSource.filterPredicate = (data: any, filter): boolean=>{
                    return data.name.toLowerCase().includes(filter) ||
                        data.lastName.toLowerCase().includes(filter) ||
                        data.email.toLowerCase().includes(filter) ||
                        data.phone.toLowerCase().includes(filter) ||
                        data.role.toLowerCase().includes(filter)
                }
            }
        })
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    createEditUser(): void {
        this.dialog.open(UserCreatEditComponent, { width: '600px', maxWidth: '600px', data:null})
    }

    applyFilter(event: Event): void {
        this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
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

    showUserDetails(row: UserModel) {
        this.router.navigateByUrl(`super-admin/users/show/${row.id}`)
    }
}
