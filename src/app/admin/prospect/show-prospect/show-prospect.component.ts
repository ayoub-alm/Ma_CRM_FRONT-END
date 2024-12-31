import {AfterViewInit, Component, OnInit, viewChild} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {BehaviorSubject, catchError, EMPTY, tap} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {AsyncPipe, DatePipe, JsonPipe, KeyValuePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../../environments/environment';
import {ProspectService} from '../../../../services/Leads/prospect.service';
import {ProspectResponseDto} from '../../../../dtos/response/prospect.response.dto';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {TimelineModule} from 'primeng/timeline';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule} from '@angular/material/card';
import {NgxTimelineComponent, NgxTimelineEvent} from '@frxjs/ngx-timeline';
import {MatList, MatListItem} from '@angular/material/list';
import {InLineEditInputComponent} from '../../../../utile/in-line-edit-input/in-line-edit-input.component';
import {MatDivider} from '@angular/material/divider';
import {AddProspectDialogComponent} from '../add-prospect-dialog/add-prospect-dialog.component';
import {InterlocutorResDto} from '../../../../dtos/response/interlocutor.dto';
import {InterlocutorService} from '../../../../services/Leads/interlocutor.service';
import {ProspectStatus} from '../../../../enums/prospect.status';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {InplaceModule} from 'primeng/inplace';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatChip} from '@angular/material/chips';

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-show-prospect',
  standalone: true,
  imports: [MatIcon, MatExpansionPanelHeader, MatExpansionPanel, MatExpansionPanelTitle, MatAccordion, MatTab,
    MatTabLabel, AsyncPipe, NgForOf, MatTabGroup, RouterLink, MatButton, MatSlideToggle, TimelineModule, MatIconButton,
    MatCardHeader, MatCard, MatLabel, MatCardActions, MatExpansionPanelDescription, MatCardContent, MatCardModule,
    NgxTimelineComponent, DatePipe, NgClass, JsonPipe, NgIf, MatList, MatListItem, InLineEditInputComponent, MatDivider,
    MatFormField, MatOption, MatSelect, InplaceModule, InputTextModule, KeyValuePipe, ReactiveFormsModule, MatChip],
  templateUrl: './show-prospect.component.html',
  styleUrl: './show-prospect.component.css'
})
export class ShowProspectComponent implements AfterViewInit, OnInit {
  prospect: BehaviorSubject<ProspectResponseDto>;
  accordion = viewChild.required(MatAccordion);
  events:any[] = [];
  interlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([])
  statusForm: FormGroup;
  protected readonly environment = environment;
  isEditStatus: boolean = false;
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private prospectService: ProspectService,
              private snackBar: MatSnackBar, private dialog: MatDialog, private interlocutorsService: InterlocutorService) {
    const blankCompany: ProspectResponseDto = {} as ProspectResponseDto;
    this.prospect = new BehaviorSubject<ProspectResponseDto>(blankCompany);

    // this.events = [{
    //   timestamp: new Date('2024-01-01T12:00:00'), title: 'New Year Celebration', description: '', id: 1
    // }, {
    //   timestamp: new Date('2024-02-14T08:00:00'), title: 'Valentine\'s Day', description: '', id: 2
    // }, {
    //   timestamp: new Date('2024-04-01T09:00:00'), title: 'April Fool\'s Day', description: '', id: 3
    // }];


    this.statusForm =  fb.group({
      status:['']
    })
  }


  ngOnInit() {
    const prospectId = this.activatedRoute.snapshot.paramMap.get('id');
    if (prospectId) {
      this.prospectService.getProspectById(parseInt(prospectId)).pipe(tap(prospect => {
        this.prospect.next(prospect);
        this.events = prospect.trackingLogs.map(track => {
          return  {
            id: track.id,
            title: track.actionType,
            description: track.details,
            timestamp:  new Date(track.timestamp),
            user: track.user,
          }
        })
      }), catchError((error) => {
        this.snackBar.open(error.message, "Ok", {duration: 3000});
        return EMPTY; // Ensures the observable completes
      })).subscribe();

      this.interlocutorsService.getInterlocutorsByProspectId(parseInt(prospectId)).pipe(
        tap(data => {
        this.interlocutors.next(data);
      })).subscribe()

    } else {
      this.snackBar.open("Invalid company ID", "Ok", {duration: 3000});
    }

    // listen to changes in status field
    this.statusForm.get('status')?.valueChanges.pipe(tap(newStatus => {
      this.prospect.getValue().status = newStatus;
      this.prospectService.updateProspectStatus(this.prospect.getValue().id, newStatus).pipe(tap(data => {
        this.prospect.next(data)
        this.events = data.trackingLogs.map(track => {
          return  {
            id: track.id,
            title: track.actionType,
            description: track.details,
            timestamp:  new Date(track.timestamp),
            user: track.user,
          }
        })
        this.isEditStatus = !this.isEditStatus;
      })).subscribe()

    })).subscribe()
  }

  /**
   * This function allows to edit prospect
   * @param row
   */
  editProspect(row: any): void {
    // Open dialog for editing the prospect
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      maxWidth: '900px', data: this.prospect.getValue() // Pass the prospect data to the dialog for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result, update the prospect if necessary
        this.prospect.next(result)
      }
    });
  }

  ngAfterViewInit() {
    // Any additional logic after view initialization can go here
  }


  getChipClass(status: string): string {
    switch (status) {
      case "NEW":
        return 'status-new'; // Apply class for "NEW"
      case "QUALIFIED":
        return 'status-qualified'; // Apply class for "QUALIFIED"
      case "INTERESTED":
        return 'status-interested'; // Apply class for "INTERESTED"
      case "OPPORTUNITY":
        return 'status-opportunity'; // Apply class for "OPPORTUNITY"
      case "CONVERTED":
        return 'status-converted'; // Apply class for "CONVERTED"
      case "DISQUALIFIED":
        return 'status-disqualified'; // Apply class for "DISQUALIFIED"
      case "LOST":
        return 'status-lost'; // Apply class for "LOST"
      case "NRP":
        return 'status-nrp'; // Apply class for "NRP"
      default:
        return 'status-default'; // Apply default class for unknown statuses
    }
  }

  getProspectStatusLabel(status: string): string {
    return ProspectStatus[status as keyof typeof ProspectStatus] || "Unknown Status";
  }

  /**
   * this function show add new project dialog
   */
  showAddNewProjectDialog() {
    //   const dialogRef = this.dialogRef.open(AddProjectDialogComponent,{
    //     width:'50%',
    //     data: {
    //       companyId: this.company.getValue().id,
    //     },
    //   })
    //
    //   dialogRef.afterClosed().pipe(
    //     tap(project => {
    //       if (project != null) {
    //         this.companyProjects.next([...this.companyProjects.getValue(),project])
    //       }
    //     })
    //   ).subscribe()
  }

  /**
   * Get icon for status
   * @param statusKey
   */
  getIconClass(statusKey: string): string {
    switch (statusKey) {
      case 'NEW':
        return 'bi-person-plus'; // Icon for "Nouvelle"
      case 'QUALIFIED':
        return 'bi-check-circle'; // Icon for "Qualifiée"
      case 'INTERESTED':
        return 'bi-star'; // Icon for "Intéressée"
      case 'OPPORTUNITY':
        return 'bi-briefcase'; // Icon for "Opportunité"
      case 'CONVERTED':
        return 'bi-clipboard-check'; // Icon for "Convertie"
      case 'DISQUALIFIED':
        return 'bi-x-circle'; // Icon for "Disqualifiée"
      case 'LOST':
        return 'bi-person-dash'; // Icon for "Perdue"
      case 'NRP':
        return 'bi-question-circle'; // Icon for "NRP"
      default:
        return 'bi-circle'; // Default icon
    }
  }

  protected readonly ProspectStatus = ProspectStatus;
}
