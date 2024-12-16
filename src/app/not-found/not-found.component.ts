import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  navigateToAdmin() {
   window.location.href = '/admin'
  }
}
