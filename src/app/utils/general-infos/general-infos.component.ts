import {Component, Input, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent} from '@angular/material/card';
import {DatePipe} from '@angular/common';
import {UserDto} from '../../../dtos/response/usersResponseDto';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSnackBar} from '@angular/material/snack-bar';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-general-infos',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    MatCardContent,
    MatCard,
    DatePipe,
    MatTooltip
  ],
  templateUrl: './general-infos.component.html',
  styleUrl: './general-infos.component.css'
})
export class GeneralInfosComponent {
  @Input() updatedBy?: UserDto;
  @Input() updatedAt?: Date;
  @Input() createdBy?: UserDto;
  @Input() createdAt?: Date;

  @Output() onClickOnComment: EventEmitter<any> =  new EventEmitter<any>();
  @Output() onClickOnTrackingLog: EventEmitter<any> =  new EventEmitter<any>();
  
  constructor(private snackBar: MatSnackBar) {
  }
  openBottomSheet() {
    this.onClickOnTrackingLog.emit();
  }


  copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('URL copied!', 'OK', {duration: 2000}); // Optional feedback
    }).catch(err => {
      console.error('Failed to copy URL:', err);
    });
  }

  onClickOnCommentBtn() {
    this.onClickOnComment.emit(true);
  }
}

