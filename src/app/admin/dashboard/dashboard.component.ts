import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {ChartModule} from 'primeng/chart';
import {BaseChartDirective} from 'ng2-charts';
import {DashboardService} from '../../../services/Leads/dashboard.service';
import {getLabelFromStatus, getStatusFromLabel, ProspectStatus} from '../../../enums/prospect.status';
import {LeadsDashboardCounts} from '../../../dtos/response/leads.dashboard.counts';
import {BehaviorSubject, catchError, of, tap} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {
  MatAccordion, MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem} from '@angular/material/menu';
import {RouterLink} from '@angular/router';
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCard,
    ChartModule, MatNativeDateModule,
    MatCardHeader, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule,
    MatCardContent,
    BaseChartDirective, MatCardTitle, MatIcon, MatInput, MatFormField, MatLabel, MatAccordion,
    MatExpansionPanelDescription, MatExpansionPanelTitle, MatExpansionPanelHeader, MatExpansionPanel, MatButton,
    MatIconButton, MatMenu, MatMenuItem, RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.Default,

})
export class DashboardComponent implements OnInit {
  counts: BehaviorSubject<LeadsDashboardCounts> = new BehaviorSubject<LeadsDashboardCounts>({} as LeadsDashboardCounts);
  barChartLabels: string[] = [];
  barChartData: any[] = [];
  barChartType: string = 'bar';
  chartOptions = {
    responsive: true,
    color: '#005cbb',
  };


  readonly campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
  readonly campaignTwo = new FormGroup({
    start: new FormControl(new Date(year, month, 15)),
    end: new FormControl(new Date(year, month, 19)),
  });

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getProspectCountPerStatus().subscribe(counts => {
      this.barChartLabels = counts.sort((a, b) => b.count - a.count).map(item => getLabelFromStatus(item.status) || 'Unknown'); // Safely handle undefined labels
      this.barChartData = [
        {
          data: counts.map(item => item.count), // Extract data
          label: 'Prospects par statut',
          // backgroundColor: [
          //   '#d4edda', // NEW
          //   '#c3e6cb', // QUALIFIED
          //   '#ffeeba', // INTERESTED
          //   '#cde0ff', // OPPORTUNITY
          //   '#d4edda', // CONVERTED
          //   '#f8d7da', // DISQUALIFIED
          //   '#e2e3e5', // LOST
          //   '#d6d8db'  // NRP
          // ],
          // borderColor: [
          //   '#155724', // NEW
          //   '#155724', // QUALIFIED
          //   '#856404', // INTERESTED
          //   '#004085', // OPPORTUNITY
          //   '#155724', // CONVERTED
          //   '#721c24', // DISQUALIFIED
          //   '#383d41', // LOST
          //   '#1b1e21'  // NRP
          // ],
          // borderWidth: 1
        }
      ];
    });

    this.dashboardService.getCounts().pipe(
      tap(data => {this.counts.next(data);}),
      catchError(err => {
        console.log(err)
        return of(null)
      })
    ).subscribe()
  }
}
