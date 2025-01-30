import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {InteractionResponseDto} from '../../../dtos/response/interaction.response.dto';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {InteractionService} from '../../../services/Leads/interaction.service';
import {MatSnackBar} from '@angular/material/snack-bar';

import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgClass} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AddEditInteractionDialogComponent} from './add-edit-interaction-dialog/add-edit-interaction-dialog.component';
import {MatChip} from "@angular/material/chips";
import {ConfirmationDialogComponent} from "../../utils/confirmation-dialog/confirmation-dialog.component";
import {tap} from "rxjs";


@Component({
  selector: 'app-interaction',
  standalone: true,
  imports: [
    MatCell,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatMenuTrigger,
    MatMenu,
    MatIcon,
    MatPaginator,
    DatePipe,
    MatTable,
    MatInput,
    MatButton,
    MatIconButton,
    MatMenuItem,
    MatHeaderRow,
    MatRow,
    MatSort,
    RouterLink, MatSortHeader, MatCellDef, MatHeaderRowDef, MatRowDef, MatNoDataRow, MatChip, NgClass
  ],
  templateUrl: './interaction.component.html',
  styleUrl: './interaction.component.css',
})
export class InteractionComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'prospectName', 'interlocutorName', 'interactionSubject', 'interactionType',
    'planningDate', 'status', 'affectedTo', 'actions'];

  dataSource: MatTableDataSource<InteractionResponseDto> = new MatTableDataSource();
  isAllSelected = false;
  selectedRows: Set<number> = new Set();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private interactionService: InteractionService, private dialog: MatDialog, private snackBar: MatSnackBar,
              private router: Router) {}

  ngOnInit(): void {
    this.loadInteractions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInteractions(): void {
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

  openAddInteractionDialog(): void {
    const dialogRef = this.dialog.open(AddEditInteractionDialogComponent, {
      maxWidth: '900px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadInteractions();
      }
    });
  }

  editInteraction(row: InteractionResponseDto): void {
    const dialogRef = this.dialog.open(AddEditInteractionDialogComponent, {
      maxWidth: '900px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadInteractions();
      }
    });
  }

  // deleteInteraction(row: InteractionResponseDto): void {
  //   if (confirm('Are you sure you want to delete this interaction?')) {
  //     this.interactionService.softDeleteInteraction(row.id).subscribe(() => {
  //       this.snackBar.open('Interaction deleted successfully', 'Close', { duration: 3000 });
  //       this.loadInteractions();
  //     });
  //   }
  // }

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
    this.router.navigateByUrl('/admin/interactions/' + row.id).then(r => {return;});
  }

  getChipClass(report: string | null): string {
    return report !== null  && report !== '' ? 'status-complete' : 'status-not-complete';
  }

  getStatusLabel(report: string | null): string {
    return report !== null  && report !== '' ? 'Complet' : 'Pas complet';
  }

  // Delete Use component comfirmation dialog
  deleteInteraction(row: any): void {
    const dialogRef = ConfirmationDialogComponent.open(this.dialog, {
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet Interaction ?',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      confirmButtonColor: 'warn', // Set the confirm button color to red
    });

    dialogRef.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.interactionService.softDeleteInteraction(row.id).pipe(
            tap({
              next: () => {
                // Remove the deleted item from the data source
                const index = this.dataSource.data.findIndex(p => p.id === row.id);
                if (index !== -1) {
                  const updatedData = [...this.dataSource.data]; // Create a new array
                  updatedData.splice(index, 1); // Remove the item
                  this.dataSource.data = updatedData; // Assign the new array
                }

                // Show success message
                this.snackBar.open('Suppression confirmée avec succès !', 'Fermer', {
                  duration: 3000,
                  panelClass: ['success-snackbar'],
                });
              },
              error: (error) => {
                // Handle server-side errors
                this.snackBar.open('Échec de la suppression. Veuillez réessayer.', 'Fermer', {
                  duration: 3000,
                  panelClass: ['error-snackbar'],
                });
                console.error('Error deleting interaction:', error);
              },
            })
        ).subscribe();
      }
    });
  }
}
