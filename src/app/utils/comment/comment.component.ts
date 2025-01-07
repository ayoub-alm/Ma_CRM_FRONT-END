import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";

import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf, NgFor, DatePipe, AsyncPipe} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatBadge} from '@angular/material/badge';
import {CommentRequestDto, ReplyRequestDto} from "../../../dtos/request/CreateCommentDto";
import {CommentResponseDto} from "../../../dtos/response/CommentResponseDto";
import {CommentService} from "../../../services/comment.service";
import {EntityEnum} from "../../../enums/entity.enum";
import {AuthService} from "../../../services/AuthService";
import {MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';



@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    MatButton,
    PaginatorModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgFor,
    MatIconButton,
    MatIcon,
    DatePipe,
    MatBadge,
    MatFabButton,
    AsyncPipe,
    MatSidenavContent,
    MatSidenavContainer
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit, AfterViewInit {
  comments: BehaviorSubject<CommentResponseDto[]> = new BehaviorSubject<CommentResponseDto[]>([]);
  @Input() replies: CommentResponseDto[] = [];
  @Input() entity!: EntityEnum;
  @Input() entityId!: number;

  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>;

  isCommentOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  hoveredCommentIndex: number | null = null; // Track hovered comment index
  commentForm: FormGroup;
  replyForm: FormGroup;
  newComment: string = '';
  replyIndex: number | null = null;

  constructor(private commentService: CommentService,
              private snackBar: MatSnackBar,
              private fb: FormBuilder,
              private authService: AuthService) {
    this.commentForm = this.fb.group({
      comment:['', Validators.required]
    })

    this.replyForm = this.fb.group({
      reply:['', Validators.required]
    })
  }

  ngOnInit(): void {
    // this.loadComments(); // Load comments on component initialization
  }


  ngAfterViewInit() {
    setTimeout(()=>{
      this.loadComments()
    },1000)
  }

  /**
   * Fetch comments from the service
   */
  loadComments(): void {
    this.commentService.getCommentsByEntityAndEntityId(this.entity, this.entityId)
        .subscribe((comments: CommentResponseDto[]) => {
          this.comments.next(comments);
        });
  }

  toggleComment(): void {
    this.isCommentOpen.next(!this.isCommentOpen.getValue())
  }

  closeComment(): void {
    this.isCommentOpen.next(false) // Close the comments and show the button again
  }


  /**
   * This function allows to Add comment
   */
  addComment(): void {
    // alert(this.commentForm.get("comment")?.value);
    if (this.commentForm.get('comment')?.value?.trim()){
      const commentRequest: CommentRequestDto = {
        entity: this.entity,
        commentTxt: this.commentForm.get('comment')?.value?.trim(),
        userId: this.authService.getCurrentUserId(),
        entityId: this.entityId,

      };
      this.commentService.addComment(commentRequest)
          .subscribe((response: CommentResponseDto) => {
            this.comments.next([... this.comments.getValue(), response])
            // Update UI with the new comment
            this.commentForm.reset();
          });
    }
  }


  /**
   * This function allows to delete comment
   */
  deleteComment(index: number): void {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?');
    if (confirmation) {
      this.comments.getValue().splice(index, 1); // Remove the comment from the array
      this.snackBar.open('Commentaire supprimé avec succès', 'Fermer', {
        duration: 3000,
      });
    }
  }

}
