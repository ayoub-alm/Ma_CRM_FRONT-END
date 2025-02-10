import { Component } from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatIcon,
    NgIf,
    RouterLink
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {

}
