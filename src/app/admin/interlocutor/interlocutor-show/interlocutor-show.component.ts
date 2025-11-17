import {Component, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {NgxTimelineComponent, NgxTimelineEvent} from '@frxjs/ngx-timeline';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BehaviorSubject, filter, tap} from 'rxjs';
import {InterlocutorResDto} from '../../../../dtos/response/interlocutor.dto';
import {InterlocutorService} from '../../../../services/Leads/interlocutor.service';
import {AddUpdateInterlocutorComponent} from '../add-update-interlocutor/add-update-interlocutor.component';
import {MatDialog} from '@angular/material/dialog';
import {InteractionResponseDto} from '../../../../dtos/response/interaction.response.dto';
import {InteractionService} from '../../../../services/Leads/interaction.service';
import {EntityEnum} from '../../../../enums/entity.enum';
import {CommentComponent} from '../../../utils/comment/comment.component';
import {ActiveEnum} from "../../../../enums/active.enum";
import {GeneralInfosComponent} from "../../../utils/general-infos/general-infos.component";
import {
  AddEditInteractionDialogComponent
} from '../../interaction/add-edit-interaction-dialog/add-edit-interaction-dialog.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {TrackingLogComponent} from '../../../utils/tracking-log/tracking-log.component';
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-interlocutor-show',
  standalone: true,
  imports: [
    MatButton,
    MatCardContent,
    MatCardTitle,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    NgIf,
    NgxTimelineComponent,
    RouterLink,
    NgClass,
    MatCard,
    AsyncPipe,
    NgForOf,
    DatePipe,
    CommentComponent,
    GeneralInfosComponent,
    MatIconButton,
    MatDrawer,
    MatToolbar,
    MatDrawerContainer,
    MatAccordion,
    TranslatePipe
  ],
  templateUrl: './interlocutor-show.component.html',
  styleUrl: './interlocutor-show.component.css'
})
export class InterlocutorShowComponent implements OnInit{
  interlocutor: BehaviorSubject<InterlocutorResDto> = new BehaviorSubject<InterlocutorResDto>({} as InterlocutorResDto);
  interactions: BehaviorSubject<InteractionResponseDto[]> = new BehaviorSubject<InteractionResponseDto[]>([]);
  events: NgxTimelineEvent[];
  selectedInteraction: BehaviorSubject<InteractionResponseDto> =  new BehaviorSubject({} as InteractionResponseDto)
  @ViewChild('leftDrawer') leftDrawer: MatDrawer | undefined;
  constructor(
    private interlocutorService: InterlocutorService,
    private activeRouter: ActivatedRoute,
    private dialog: MatDialog,
    private interactionsService: InteractionService,
    private bottomSheet: MatBottomSheet
  ) {
    this.events =  [
      {
        timestamp: new Date('2024-01-01T12:00:00'),
        title: 'New Year Celebration',
        description: '',
        id: 1
      },
      {
        timestamp: new Date('2024-02-14T08:00:00'),
        title: 'Valentine\'s Day',
        description: '',
        id: 2
      },
      {
        timestamp: new Date('2024-04-01T09:00:00'),
        title: 'April Fool\'s Day',
        description: '',
        id: 3
      }
    ];
  }

  ngOnInit() {
    // get the interlocutor
    const interlocutorId:string | null = this.activeRouter.snapshot.paramMap.get('id');
    if (interlocutorId) {
      this.interlocutorService.getInterlocutorById(parseInt(interlocutorId)).pipe(tap(data => {
        this.interlocutor.next(data);
      }),
      ).subscribe()

      this.interactionsService.getAllInteractionsByInterlocutorId(parseInt(interlocutorId)).pipe(tap(data => {
        this.interactions.next(data);
         this.events = this.interactions.getValue().map(int => {
           return  {
             id: int.id,
             title: int.interactionType,
             description: int.interactionSubject,
             timestamp:  new Date(int.createdAt)
           };
         });
        })
      ).subscribe()
    }


  }


  openInteractionInDrawer(interaction: InteractionResponseDto): void {
    this.selectedInteraction.next(interaction) ;
    if (!this.leftDrawer?.opened) this.leftDrawer?.toggle();
  }

  openUpdateInterlocutorDialog(interlocutor?: InterlocutorResDto): void {
    console.log(this.interlocutor.getValue())
    const dialogRef = this.dialog.open(AddUpdateInterlocutorComponent, {
      maxWidth: '900px',
      maxHeight: '100vh',
      data: this.interlocutor.getValue(),
    });



    dialogRef.afterClosed().pipe(
      filter(response => !!response), // Proceed only if response is not null/undefined
      tap(response => {
       this.interlocutor.next(response)
      })
    ).subscribe();
  }
  protected readonly alert = alert;
  protected readonly EntityEnum = EntityEnum;

  getAllStatusInteraction(status: string): string {
    return ActiveEnum[status as keyof typeof ActiveEnum] || "Unknown Status";
  }

  getChipClass(status: string): string {
    switch (status) {
      case "ACTIVE":
        return 'status-active'; // Apply class for "NEW"
      case "INACTIVE":
        return 'status-inactive'; // Apply class for "QUALIFIED"
      default:
        return 'status-default'; // Apply default class for unknown statuses
    }
  }

  onAddNewInteraction() {
    const dialogRef = this.dialog.open(AddEditInteractionDialogComponent, {
      maxWidth: '900px', data: new InteractionResponseDto({
        interlocutorId:this.interlocutor.getValue().id,
        customerId:this.interlocutor.getValue().customer.id
      }) // Pass the prospect data to the dialog for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result, update the prospect if necessary
        this.interactions.next([... this.interactions.getValue(),result])
      }
    });
  }

  getStatusLabel(report: string | null): string {
    return report && report.trim() !== '' ? 'Terminé' : 'En attente';
  }

  getChipClass2(report: string | null): string {
    return report && report.trim() !== ''
      ? 'bg-success text-white'
      : 'bg-warning text-dark';
  }

  openTrackingLog(): void {
    const interlocutorData = this.interlocutor.getValue();
    if (interlocutorData && interlocutorData.id) {
      const entityType = 'com.sales_scout.entity.leads.Interlocutor';
      const entityId = interlocutorData.id;
      this.bottomSheet.open(TrackingLogComponent, {
        data: { entityType, entityId }
      });
    }
  }
}
