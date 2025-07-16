import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {BehaviorSubject, catchError, EMPTY, of, Subscription, tap} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../../environments/environment';
import {ProspectService} from '../../../../services/Leads/prospect.service';
import {ProspectResponseDto} from '../../../../dtos/response/prospect.response.dto';
import {MatButton, MatIconButton} from '@angular/material/button';
import {TimelineModule} from 'primeng/timeline';
import {MatCardContent, MatCardModule} from '@angular/material/card';
import {AddProspectDialogComponent} from '../add-prospect-dialog/add-prospect-dialog.component';
import {InterlocutorResDto} from '../../../../dtos/response/interlocutor.dto';
import {InterlocutorService} from '../../../../services/Leads/interlocutor.service';
import {ProspectStatus} from '../../../../enums/prospect.status';
import {InplaceModule} from 'primeng/inplace';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {EntityEnum} from '../../../../enums/entity.enum';
import {InterestResponseDto} from "../../../../dtos/response/interestResponseDto";
import {LocalStorageService} from "../../../../services/local.storage.service";
import {CustomerStatusService} from '../../../../services/Leads/customer.status.service';
import {GeneralInfosComponent} from "../../../utils/general-infos/general-infos.component";
import {CustomerStatus} from '../../../../dtos/response/cutomer.status.dto';
import {
  AddUpdateInterlocutorComponent
} from '../../interlocutor/add-update-interlocutor/add-update-interlocutor.component';
import {MatChip} from '@angular/material/chips';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {CommentComponent} from '../../../utils/comment/comment.component';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {NgxTimelineComponent} from '@frxjs/ngx-timeline';
import {TranslatePipe} from '@ngx-translate/core';

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
  imports: [MatIcon, MatExpansionPanelHeader, MatExpansionPanel, MatExpansionPanelTitle, MatTab, MatTabLabel, AsyncPipe,
    NgForOf, MatTabGroup, RouterLink, MatButton, TimelineModule, MatCardContent, MatCardModule, NgClass, InplaceModule,
    InputTextModule, ReactiveFormsModule, NgIf, MatIconButton, MatDrawerContainer, MatDrawer, MatSlideToggle, CommentComponent, MatDrawer,
    MatToolbar, GeneralInfosComponent, NgxTimelineComponent, TranslatePipe],
  templateUrl: './show-prospect.component.html',
  styleUrl: './show-prospect.component.css'
})
export class ShowProspectComponent implements AfterViewInit, OnInit, OnDestroy {
  subscriptions!: Subscription[];
  interests: BehaviorSubject<InterestResponseDto[]> = new BehaviorSubject<InterestResponseDto[]>([]);
  customer: BehaviorSubject<ProspectResponseDto>;
  events: any[] = [];
  interlocutors: BehaviorSubject<InterlocutorResDto[]> = new BehaviorSubject<InterlocutorResDto[]>([])
  statusForm: FormGroup;
  isEditStatus: boolean = false;
  prospectForm!: FormGroup;
  customersStatus:BehaviorSubject<CustomerStatus[]> = new BehaviorSubject<CustomerStatus[]>([])
  protected readonly environment = environment;

  protected readonly EntityEnum = EntityEnum;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private prospectService: ProspectService,
              private snackBar: MatSnackBar, private dialog: MatDialog, private interlocutorsService: InterlocutorService,
              private localStorageService: LocalStorageService, private customerStatusService: CustomerStatusService) {
    const blankCompany: ProspectResponseDto = {} as ProspectResponseDto;
    this.customer = new BehaviorSubject<ProspectResponseDto>(blankCompany);

    // this.events = [{
    //   timestamp: new Date('2024-01-01T12:00:00'), title: 'New Year Celebration', description: '', id: 1
    // }, {
    //   timestamp: new Date('2024-02-14T08:00:00'), title: 'Valentine\'s Day', description: '', id: 2
    // }, {
    //   timestamp: new Date('2024-04-01T09:00:00'), title: 'April Fool\'s Day', description: '', id: 3
    // }];
    this.prospectForm = this.fb.group({
      report: [''],
    });

    this.statusForm = fb.group({
      statusId: [""]
    })
  }

  ngOnInit() {
    const prospectId = this.activatedRoute.snapshot.paramMap.get('id');
    if (prospectId) {
      this.prospectService.getCustomerById(parseInt(prospectId)).pipe(tap(prospect => {
        this.customer.next(prospect);
        console.log(this.customer.getValue());
        this.statusForm.patchValue({ status: prospect.active });
      }), catchError((error) => {
        this.snackBar.open(error.message, "Ok", {duration: 3000});
        return EMPTY; // Ensures the observable completes
      })).subscribe();

      this.interlocutorsService.getInterlocutorsByProspectId(parseInt(prospectId)).pipe(tap(data => {
        this.interlocutors.next(data);
      })).subscribe()

    } else {
      this.snackBar.open("Invalid company ID", "Ok", {duration: 3000});
    }



    // listen to changes in status field
    // this.statusForm.get('status')?.valueChanges.pipe(tap(newStatus => {
    //   this.prospect.getValue().active = newStatus;
    //   this.prospectService.updateCustomerStatus(this.prospect.getValue().id, newStatus).pipe(tap(data => {
    //     this.prospect.next(data)
    //     this.events = data.trackingLogs.map(track => {
    //       return {
    //         id: track.id,
    //         title: track.actionType,
    //         description: track.details,
    //         timestamp: new Date(track.timestamp),
    //         user: track.user,
    //       }
    //     })
    //     this.isEditStatus = !this.isEditStatus;
    //   })).subscribe()
    //
    // })).subscribe()
    // Add this to load the toggle states

  }
  ngAfterViewInit() {
    this.customerStatusService.getAllActiveStatuses().pipe(
      tap(statuses => {
        this.customersStatus.next(statuses);
        // Patch the value once statuses are loaded
        this.statusForm.patchValue({statusId: this.customer.getValue().customerStatus?.id});
      })
    ).subscribe();

    this.statusForm.get('statusId')!.valueChanges.pipe(
      tap((newStatusId: number) => {
        const customerId = this.customer.getValue().id;
        if (this.customer.getValue().customerStatus?.id !== newStatusId) {
          this.prospectService.updateCustomerStatus(customerId, newStatusId).pipe(
            tap(updatedCustomer => {
              const newStatus = this.customersStatus.getValue().find(s => s.id === updatedCustomer.customerStatus.id);
              this.customer.next({
                ...this.customer.getValue(),
                customerStatus: newStatus !== undefined ? newStatus : updatedCustomer.customerStatus

              });
              this.events = updatedCustomer.trackingLogs.map(track => ({
                id: track.id,
                title: track.actionType,
                description: track.details,
                timestamp: new Date(track.timestamp),
                user: track.user,
              }));
              this.isEditStatus = false;
            })
          ).subscribe();
        }else{
          return;
        }

      })).subscribe()

    this.loadInterests();
  }
  /**
   * Load toggle states from the Interest
   */
  loadInterests() {
    this.prospectService.getInterestByCompanyId(this.localStorageService.getItem("selected_company_id"))
      .subscribe((interest: InterestResponseDto[]) => {
        this.interests.next(interest);
      });
  }

  /**
   * Update Interest toggle state
   */
  updateInterest( interestId: number) {
    // const isChecked = event.checked; // ✅ Correct way to get checkbox state
    alert("test")
    // Check if the prospect already has this interest
    if (this.customer.getValue().interest) {
      const hasInterest = !!this.customer.getValue().interest.find(interest => interest.id === interestId);

      // Call the appropriate service method based on the checkbox state
      const requestObservable = hasInterest ? this.prospectService.addInterestToCustomer(this.customer.getValue().id, interestId) : this.prospectService.removeInterestFromCustomer(this.customer.getValue().id, interestId);

      // Execute the request and handle responses
      requestObservable.pipe(tap(() => {
        this.snackBar.open(`Intérêt ${hasInterest ? 'ajouté' : 'supprimé'} avec succès ✅`, 'Fermer', {duration: 3000});
        // Refresh local interests list
        this.loadInterests();
      }), catchError((err) => {
        this.snackBar.open('Erreur lors de la mise à jour de l\'intérêt ⛔', 'Fermer', {duration: 3000});
        return of(null);
      })).subscribe();
    } else {
      // const hasInterest = !!this.prospect.getValue().interests.find(interest => interest.id === interestId);

      // Call the appropriate service method based on the checkbox state
      const requestObservable = this.prospectService.addInterestToCustomer(this.customer.getValue().id, interestId)


      // Execute the request and handle responses
      requestObservable.pipe(tap(() => {
        this.snackBar.open(`Intérêt ${'ajouté'} avec succès ✅`, 'Fermer', {duration: 3000});

        // Refresh local interests list
        this.loadInterests();
      }), catchError((err) => {
        this.snackBar.open('Erreur lors de la mise à jour de l\'intérêt ⛔', 'Fermer', {duration: 3000});
        return of(null);
      })).subscribe();
    }
  }


  /**
   * This function allows to edit prospect
   * @param row
   */
  editProspect(row: any): void {
    // Open dialog for editing the prospect
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      maxWidth: '900px', data: this.customer.getValue() // Pass the prospect data to the dialog for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result, update the prospect if necessary
        this.customer.next(result)
      }
    });
  }


  getChipClass(status: string): string {
    switch (status.toLowerCase()) {
      case "nouvelle":
        return "status-new"; // "NEW"
      case "qualifiée":
        return "status-qualified"; // "QUALIFIED"
      case "intéressée":
        return "status-interested"; // "INTERESTED"
      case "opportunité":
        return "status-opportunity"; // "OPPORTUNITY"
      case "convertie":
        return "status-converted"; // "CONVERTED"
      case "disqualifiée":
        return "status-disqualified"; // "DISQUALIFIED"
      case "perdue":
        return "status-lost"; // "LOST"
      case "nrp":
        return "status-nrp"; // "NRP"
      default:
        return "status-default"; // Default class for unknown statuses
    }
  }


  getProspectStatusLabel(status: string): string {
    return ProspectStatus[status as keyof typeof ProspectStatus] || "Unknown Status";
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

  ngOnDestroy() {
    // this.subscriptions.forEach(subscription => {
    //     subscription.unsubscribe();
    // })
  }

  isChecked(name: string): boolean {
    if (this.customer.getValue().interest) {
      return this.customer.getValue().interest.some(interest => interest.name === name);
    } else {
      return false;
    }
  }

  showChangeStatusForm() {
    this.isEditStatus = true;
  }

  onAddNewContacts() {
    const dialogRef = this.dialog.open(AddUpdateInterlocutorComponent, {
      maxWidth: '900px', data: new InterlocutorResDto({customer:this.customer.getValue()}) // Pass the prospect data to the dialog for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result, update the prospect if necessary
        this.interlocutors.next([... this.interlocutors.getValue(),result])
      }
    });
  }
}
