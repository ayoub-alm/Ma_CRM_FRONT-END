import {Component, inject, Inject, OnInit} from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {MatListModule, MatListItem} from '@angular/material/list';
import {DatePipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {TrackingLogService} from '../../../services/Leads/Tracking.log.service';
import {catchError, of} from 'rxjs';

export interface TrackingLogData {
  entityType: string;
  entityId: number;
}

@Component({
  selector: 'app-tracking-log',
  standalone: true,
  imports: [MatListModule, MatListItem, DatePipe, NgForOf, NgIf, MatIcon, MatIconButton, MatButton, JsonPipe],
  templateUrl: './tracking-log.component.html',
  styleUrl: './tracking-log.component.css'
})
export class TrackingLogComponent implements OnInit {
  private _bottomSheetRef = inject<MatBottomSheetRef<TrackingLogComponent>>(MatBottomSheetRef);
  logs: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: TrackingLogData,
    private trackingLogService: TrackingLogService
  ) {}

  ngOnInit(): void {
    if (this.data?.entityType && this.data?.entityId) {
      this.loadLogs();
    } else {
      this.error = 'Entity type and ID are required';
      this.isLoading = false;
    }
  }

  loadLogs(): void {
    this.isLoading = true;
    this.trackingLogService.getLogsForEntity(this.data.entityType, this.data.entityId)
      .pipe(
        catchError(err => {
          this.error = 'Error loading tracking logs';
          console.error('Error loading tracking logs:', err);
          return of([]);
        })
      )
      .subscribe({
        next: (logs) => {
          this.logs = logs;
          this.isLoading = false;
        }
      });
  }

  getActionIcon(actionType: string): string {
    switch (actionType?.toUpperCase()) {
      case 'CREATE':
        return 'add_circle';
      case 'UPDATE':
        return 'edit';
      case 'DELETE':
        return 'delete';
      default:
        return 'info';
    }
  }

  getActionColor(actionType: string): string {
    switch (actionType?.toUpperCase()) {
      case 'CREATE':
        return 'text-success';
      case 'UPDATE':
        return 'text-primary';
      case 'DELETE':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  }

  close(): void {
    this._bottomSheetRef.dismiss();
  }
}
