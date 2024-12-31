import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
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

@Component({
  selector: 'app-interlocutor-show',
  standalone: true,
  imports: [
    MatButton,
    MatCardContent,
    MatCardTitle,
    MatDivider,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    MatSlideToggle,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    NgIf,
    NgxTimelineComponent,
    RouterLink,
    NgClass,
    MatCard,
    AsyncPipe,
    NgForOf,
    DatePipe
  ],
  templateUrl: './interlocutor-show.component.html',
  styleUrl: './interlocutor-show.component.css'
})
export class InterlocutorShowComponent implements OnInit{
  interlocutor: BehaviorSubject<InterlocutorResDto> = new BehaviorSubject<InterlocutorResDto>({} as InterlocutorResDto);
  interactions: BehaviorSubject<InteractionResponseDto[]> = new BehaviorSubject<InteractionResponseDto[]>([]);
  events: NgxTimelineEvent[];

  constructor(private interlocutorService: InterlocutorService, private activeRouter: ActivatedRoute,
              private dialog: MatDialog, private interactionsService: InteractionService) {
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

  openUpdateInterlocutorDialog(interlocutor?: InterlocutorResDto): void {
    const dialogRef = this.dialog.open(AddUpdateInterlocutorComponent, {
      maxWidth: '900px',
      maxHeight: '100vh',
      data: this.interlocutor.getValue(), // Pass the interlocutor if provided
    });



    dialogRef.afterClosed().pipe(
      filter(response => !!response), // Proceed only if response is not null/undefined
      tap(response => {
       this.interlocutor.next(response)
      })
    ).subscribe();
  }
  protected readonly alert = alert;
}
