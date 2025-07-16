import { Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {BehaviorSubject, catchError, of, tap} from "rxjs";
import {UserModel} from "../../../models/super-admin/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/super-admin/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserResponseDto} from '../../../dtos/response/super-admin-responseDtos/user.response.dto';

@Component({
  selector: 'app-user-show',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
   MatCardTitle, MatCard, MatCardContent, MatDivider
  ],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css'
})
export class UserShowComponent implements OnInit {
  user: BehaviorSubject<UserResponseDto> = new BehaviorSubject<UserResponseDto>({} as UserResponseDto);
  isEditing = false; // Controls whether the form is in edit mode or not
  showRightsPanel = false; // Controls the visibility of the rights panel


  constructor(public router: Router, private activeRouter: ActivatedRoute, private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const user:number = this.activeRouter.snapshot.params['id'];
    this.userService.getUserById(user).pipe(
        tap(data => this.user.next(data)),
        catchError((err) => {
          this.snackBar.open("Erreur de téléchargement de données", "ok", {duration: 3000})
          return of(null);}
        )).subscribe({
      next:()=> {
        console.log(this.user.getValue());
      }
    })
  }

  createEditUser(): void {
    this.router.navigate(['/admin/super-admin/users/create'], {state: {data: this.user.getValue()}})
        .then(() => console.log('Navigation successful'))
        .catch(err => console.error('Navigation error:', err));
  }

}
