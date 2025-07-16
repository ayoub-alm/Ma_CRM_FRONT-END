import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem} from "@angular/material/list";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Ma logistics';

}
