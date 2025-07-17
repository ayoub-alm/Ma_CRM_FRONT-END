import {Component, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {CustomerFilterFields} from '../../../../services/Leads/statustucs.service';
import {BehaviorSubject, catchError, of, tap} from 'rxjs';
import {LeadsDashboardCounts} from '../../../../dtos/response/leads.dashboard.counts';
import {DashboardService} from '../../../../services/Leads/dashboard.service';

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
  customersFilters!: CustomerFilterFields;
  counts: BehaviorSubject<LeadsDashboardCounts> = new BehaviorSubject<LeadsDashboardCounts>({} as LeadsDashboardCounts);
  customerPerStatusChartLabels: string[] = [];
  customerPerStatusData: any[] = [];

  customerPerSellerChartLabels: string[] = [];
  customerPerSellerData: any[] = [];

  customerPerCityChartLabels: string[] = [];
  customerPerCityData: any[] = [];

  customerPerIndustryChartLabels: string[] = [];
  customerPerIndustryData: any[] = [];

  customerPerStructureChartLabels: string[] = [];
  customerPerStructureData: any[] = [];

  customerPerDateChartLabels: string[] = [];
  customerPerDateData: any[] = [];

  chartOptions = {
    responsive: true,
    color: '#005cbb',
  };
// Define an array of colors to be used in charts
  chartColors = {
    backgroundColor: [
      '#d4edda', // NEW (Soft green)
      '#ffeeba', // INTERESTED (Soft yellow)
      '#cde0ff', // OPPORTUNITY (Light blue)
      '#d4edda', // CONVERTED (Soft green)
      '#f8d7da', // DISQUALIFIED (Soft red)
      '#e2e3e5', // LOST (Light grey)
      '#d6d8db',// NRP (Soft blue-grey)
      '#c3e6cb', // QUALIFIED (Light green)
    ],
    borderColor: [
      '#155724', // Dark green for border
      '#856404', // Amber
      '#004085', // Dark blue
      '#155724', // Dark green
      '#721c24', // Dark red
      '#383d41', // Dark grey
      '#1b1e21',  // Charcoal
      '#155724', // Dark green

    ],
    hoverBackgroundColor: [
      '#b5dab9', '#ffdd99', '#adcaff',
      '#b5dab9', '#e8b4b8', '#cacfd2', '#c4c5c7', '#a3d5a7'
    ]
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getProspectCountPerStatus().subscribe({
      next:(counts)=>{
        console.log(counts);
        this.customerPerStatusChartLabels = counts.sort((a, b) => b.count - a.count).map(item => item.label); // Safely handle undefined labels
        this.customerPerStatusData = [
          {
            data: counts.map(item => item.count),
            label: 'Client par statut',
            backgroundColor: this.chartColors.backgroundColor,
            borderColor: this.chartColors.borderColor,
            hoverBackgroundColor: this.chartColors.hoverBackgroundColor,
            borderWidth: 1            }
        ];
      }
    });
    // get counts
    this.dashboardService.getCounts().pipe(
      tap(data => {this.counts.next(data);}),
      catchError(err => {
        console.log(err)
        return of(null)
      })
    ).subscribe()
    this.getCustomerPerSellerDate();
    this.getCustomerPerCityDate();
    this.getCustomerPerIndustry();
    this.getCustomerPerStructure();
    this.getCountOfCustomerPerDate();
  }


  getCustomerPerSellerDate(){
    this.dashboardService.getCountOfCustomerPerSeller().subscribe(counts => {
      this.customerPerSellerChartLabels = counts.sort((a, b) => b.count - a.count).map(item => item.label || 'Unknown'); // Safely handle undefined labels
      this.customerPerSellerData = [
        {
          data: counts.map(item => item.count),
          label: 'Client par commercial',
          backgroundColor: this.chartColors.backgroundColor,
          borderColor: this.chartColors.borderColor,
          hoverBackgroundColor: this.chartColors.hoverBackgroundColor,
          borderWidth: 1
        }
      ];
    });
  }

  getCustomerPerCityDate(){
    this.dashboardService.getCountOfCustomerPerCity().subscribe(counts => {
      this.customerPerCityChartLabels = counts.sort((a, b) => b.count - a.count).map(item => item.label || 'Unknown'); // Safely handle undefined labels
      this.customerPerCityData = [
        {
          data: counts.map(item => item.count),
          label: 'Client par Ville',
          backgroundColor: this.chartColors.backgroundColor,
          borderColor: this.chartColors.borderColor,
          hoverBackgroundColor: this.chartColors.hoverBackgroundColor,
          borderWidth: 1
        }
      ];
    });
  }


  getCustomerPerIndustry(){
    this.dashboardService.getCountOfCustomerPerIndustry().subscribe(counts => {
      this.customerPerIndustryChartLabels = counts.sort((a, b) => b.count - a.count).map(item => item.label || 'Unknown'); // Safely handle undefined labels
      this.customerPerIndustryData = [
        {
          data: counts.map(item => item.count),
          label: 'Client par Industrie',
          backgroundColor: this.chartColors.backgroundColor,
          borderColor: this.chartColors.borderColor,
          hoverBackgroundColor: this.chartColors.hoverBackgroundColor,
          borderWidth: 1
        }
      ];
    });
  }

  getCustomerPerStructure(){
    this.dashboardService.getCountOfCustomerPerStructure().subscribe(counts => {
      this.customerPerStructureChartLabels = counts.sort((a, b) => b.count - a.count).map(item => item.label || 'Unknown'); // Safely handle undefined labels
      this.customerPerStructureData = [
        {
          data: counts.map(item => item.count),
          label: 'Client par Structure',
          backgroundColor: this.chartColors.backgroundColor,
          borderColor: this.chartColors.borderColor,
          hoverBackgroundColor: this.chartColors.hoverBackgroundColor,
          borderWidth: 1
        }
      ];
    });
  }

  getCountOfCustomerPerDate(){
    this.dashboardService.getCountOfCustomerPerDate().subscribe(counts => {
      this.customerPerDateChartLabels = counts.sort((a, b) => b.count - a.count).map(item => item.label || 'Unknown'); // Safely handle undefined labels
      this.customerPerDateData = [
        {
          data: counts.map(item => item.count),
          label: 'Client par Jour',
          backgroundColor: this.chartColors.backgroundColor,
          borderColor: this.chartColors.borderColor,
          hoverBackgroundColor: this.chartColors.hoverBackgroundColor,
          borderWidth: 1
        }
      ];
    });
  }
}

