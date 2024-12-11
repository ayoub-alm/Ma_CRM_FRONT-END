import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {ChartModule} from 'primeng/chart';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCard,
    ChartModule,
    MatCardHeader,
    MatCardContent,
    BaseChartDirective, MatCardTitle
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Data for Bar Chart
  barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May'];
  barChartData: any[] = [
    { data: [65, 59, 80, 81, 56], label: 'Sales' },
    { data: [28, 48, 40, 19, 86], label: 'Revenue' }
  ];
  barChartType: string = 'bar';

  chartOptions = {
    responsive: true,
    color:'#005cbb',
  };
}
