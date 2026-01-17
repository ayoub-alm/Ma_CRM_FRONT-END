import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from "ng2-charts";
import { MatButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { WmsDashboardCounts } from '../../../../dtos/response/crm/wms.dashboard.counts';
import { WmsDashboardService } from '../../../../services/crm/wms/wms-dashboard.service';

@Component({
  selector: 'app-wms-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatButton,
    MatCard,
    MatIcon
  ],
  templateUrl: './wms-dashboard.component.html',
  styleUrl: './wms-dashboard.component.css'
})
export class WmsDashboardComponent implements OnInit {
  counts: BehaviorSubject<WmsDashboardCounts> = new BehaviorSubject<WmsDashboardCounts>({} as WmsDashboardCounts);

  // Chart Data Holders
  offersPerStatusLabels: string[] = [];
  offersPerStatusData: any[] = [];

  chartOptions = {
    responsive: true,
    color: '#005cbb',
  };

  chartColors = {
    backgroundColor: [
      '#d4edda', '#ffeeba', '#cde0ff', '#d4edda', '#f8d7da', '#e2e3e5', '#d6d8db', '#c3e6cb'
    ],
    borderColor: [
      '#155724', '#856404', '#004085', '#155724', '#721c24', '#383d41', '#1b1e21', '#155724'
    ],
    hoverBackgroundColor: [
      '#b5dab9', '#ffdd99', '#adcaff', '#b5dab9', '#e8b4b8', '#cacfd2', '#c4c5c7', '#a3d5a7'
    ]
  };

  constructor(private dashboardService: WmsDashboardService) { }

  ngOnInit() {
    this.loadCounts();
    this.loadOffersPerStatus();
  }

  loadCounts() {
    this.dashboardService.getCounts().pipe(
      tap(data => this.counts.next(data)),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    ).subscribe();
  }

  loadOffersPerStatus() {
    this.dashboardService.getOffersPerStatus().subscribe({
      next: (counts) => {
        this.offersPerStatusLabels = counts.map(item => item.label);
        this.offersPerStatusData = [
          {
            data: counts.map(item => item.count),
            label: 'Offres par Statut',
            backgroundColor: this.chartColors.backgroundColor,
            borderColor: this.chartColors.borderColor,
            hoverBackgroundColor: this.chartColors.hoverBackgroundColor,
            borderWidth: 1
          }
        ];
      },
      error: (err) => console.error(err)
    });
  }
}

