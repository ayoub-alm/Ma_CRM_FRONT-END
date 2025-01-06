import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {NgxTimelineComponent} from "@frxjs/ngx-timeline";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BehaviorSubject, tap} from 'rxjs';
import {InteractionResponseDto} from '../../../../dtos/response/interaction.response.dto';
import {InteractionService} from '../../../../services/Leads/interaction.service';
import {EntityEnum} from "../../../../enums/entity.enum";
import {CommentComponent} from "../../../utils/comment/comment.component";

@Component({
  selector: 'app-interaction-show',
  standalone: true,
    imports: [
        AsyncPipe,
        DatePipe,
        MatButton,
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatIcon,
        NgForOf,
        NgIf,
        NgxTimelineComponent,
        RouterLink,
        CommentComponent
    ],
  templateUrl: './interaction-show.component.html',
  styleUrl: './interaction-show.component.css'
})
export class InteractionShowComponent implements OnInit{
  interaction: BehaviorSubject<InteractionResponseDto> = new BehaviorSubject<InteractionResponseDto>({} as InteractionResponseDto);

  constructor(private activeRouter: ActivatedRoute, private interactionService: InteractionService) {
  }

  ngOnInit(): void {
    const interactionId:string | null = this.activeRouter.snapshot.paramMap.get('id');
    if (interactionId){
      this.interactionService.getInteractionById(parseInt(interactionId)).pipe(tap(data => {
        this.interaction.next(data);
      })).subscribe()
    }

  }

    protected readonly EntityEnum = EntityEnum;
}
