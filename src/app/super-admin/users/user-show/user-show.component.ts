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

@Component({
  selector: 'app-user-show',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatIconButton,
    MatChipListbox,
    MatChip,
    MatFormField,
    MatSelect,
    MatOption, MatLabel, MatCardTitle, NgIf, MatCard, MatCardContent, MatMenu, MatMenuItem, MatMenuTrigger, MatDivider, MatSlideToggle, MatTab, MatTabGroup, MatTabLabel, NgForOf
  ],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css'
})
export class UserShowComponent implements OnInit {
  user: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>({} as UserModel);
  isEditing = false; // Controls whether the form is in edit mode or not
  showRightsPanel = false; // Controls the visibility of the rights panel

  // user = {
  //   matricule: '12345',
  //   name: 'John Doe',
  //   email: 'john.doe@example.com',
  //   phone: '123-456-7890',
  //   role: 'Admin',
  //   rights: [{name: 'Read Access'}, {name: 'Write Access'}],
  // };
  // roles = ['Admin', 'Editor', 'Viewer'];
  // rights = [
  //   { name: 'Admin Access', description: 'Full access to the system' },
  //   { name: 'Editor Access', description: 'Can edit content' },
  //   { name: 'Viewer Access', description: 'Can view content only' }
  // ];

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
