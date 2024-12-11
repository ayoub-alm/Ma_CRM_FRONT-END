import {AfterViewInit, Component, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import {MatTreeModule} from '@angular/material/tree';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {NgIf} from '@angular/common';
import {OpenAIService} from '../../../services/open.ai.service';
import {MatCard} from '@angular/material/card';
import {BehaviorSubject} from 'rxjs';
import {LocalStorageService} from '../../../services/local.storage.service';

interface FoodNode {
  name: string;
  icon?:string;
  url?:string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Livraisons',
    icon:'local_shipping',
    url:'/admin/deliveries',
    children: [{name: 'Tout'},{name: 'Livré', icon:"done"}, {name: 'En cours'}, {name: 'Anulée'}],
  },
];

interface FoodNode {
  name: string;
  children?: FoodNode[];
}



@Component({
  selector: 'app-index',
  standalone: true,
  imports: [MatTreeModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule,
    MatListModule, MatDividerModule, RouterLink, RouterLinkWithHref, CdkTrapFocus, NgIf, MatCard],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  user: any;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.user = this.localStorageService.getItem('user');
    if (!this.user) {
      console.warn('User data not found in localStorage (SSR-safe).');
    } else {
      this.user = JSON.parse(this.user);
    }
  }

}


