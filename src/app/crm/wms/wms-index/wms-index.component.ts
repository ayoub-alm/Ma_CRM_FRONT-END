import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-wms-index',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './wms-index.component.html',
  styleUrl: './wms-index.component.css'
})
export class WmsIndexComponent {

}
