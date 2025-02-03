import { Component } from '@angular/core';
import {CommentComponent} from "../../utils/comment/comment.component";
import {EntityEnum} from "../../../enums/entity.enum";
import {CommentResponseDto} from "../../../dtos/response/CommentResponseDto";

import {MatDialog, MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-users',
  standalone: true,
    imports: [
        CommentComponent,
        MatDialogModule
    ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent{

    protected readonly EntityEnum = EntityEnum;
    comments: CommentResponseDto[] = [];

    constructor(private dialog: MatDialog) {}


}