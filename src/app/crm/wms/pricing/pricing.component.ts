import {Component, OnDestroy, OnInit} from '@angular/core'
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from '../../../../services/AuthService';
import {LocalStorageService} from '../../../../services/local.storage.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
        ReactiveFormsModule,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    RouterLink,
    RouterOutlet,
    MatDivider
  ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent implements OnInit, OnDestroy{
  subscriptions: Subscription[] = [];
  crmType = new FormControl('');
  constructor(private authService: AuthService,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    if(this.localStorageService.getItem("current_crm") !== "" &&
        this.localStorageService.getItem("current_crm") !== null){
      this.crmType.setValue(this.localStorageService.getItem("current_crm"))
    }else{
      this.crmType.setValue("WMS")
      this.localStorageService.setItem("current_crm", "WMS")
    }
    this.subscriptions.push(
        this.crmType.valueChanges.subscribe(data => {
          this.localStorageService.setItem("current_crm", data);
          this.router.navigateByUrl('/admin/crm/pricing/'+this.localStorageService.getItem("current_crm").toLowerCase()).then((data => {return}));
        }))
  }
  /**
   * unsubscript from
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
