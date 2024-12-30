import { Component } from '@angular/core';
import {CommentComponent} from "../../utils/comment/comment.component";
import {EntityEnum} from "../../../enums/entity.enum";
import {CommentResponseDto} from "../../../dtos/response/CommentResponseDto";

@Component({
  selector: 'app-users',
  standalone: true,
    imports: [
        CommentComponent

    ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent{

    protected readonly EntityEnum = EntityEnum;
    comments: CommentResponseDto[] = [];
}