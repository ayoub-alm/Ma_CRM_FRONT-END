import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {CommentComponent} from "../../../utils/comment/comment.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GeneralInfosComponent} from "../../../utils/general-infos/general-infos.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {MatToolbar} from "@angular/material/toolbar";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {EntityEnum} from '../../../../enums/entity.enum';
import {BehaviorSubject, catchError, EMPTY, tap} from 'rxjs';
import {ProspectResponseDto} from '../../../../dtos/response/prospect.response.dto';
import {CompanyService} from '../../../../services/company.service';
import {CompanyResponseDto} from '../../../../dtos/response/CompanyResponseDto';
import {CompanyModel} from '../../../models/super-admin/company.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-company-show',
  standalone: true,
    imports: [
        AsyncPipe,
        CommentComponent,
        FormsModule,
        GeneralInfosComponent,
        MatButton,
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatDrawer,
        MatDrawerContainer,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatIcon,
        MatIconButton,
        MatSlideToggle,
        MatTab,
        MatTabGroup,
        MatTabLabel,
        MatToolbar,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        RouterLink,
        TranslatePipe
    ],
  templateUrl: './company-show.component.html',
  styleUrl: './company-show.component.css'
})
export class CompanyShowComponent implements OnInit{
  company: BehaviorSubject<CompanyModel> = new BehaviorSubject({} as CompanyModel);
  protected readonly EntityEnum = EntityEnum;
  constructor(private activatedRoute: ActivatedRoute, private companyService: CompanyService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.loadCompany();
  }

  loadCompany(): void{
    const companyId = this.activatedRoute.snapshot.paramMap.get('id');
    if (companyId) {
      this.companyService.getCompanyById(parseInt(companyId)).pipe(tap(company => {
        this.company.next(company);
      }), catchError((error) => {
        this.snackBar.open(error.message, "Ok", {duration: 3000});
        return EMPTY; // Ensures the observable completes
      })).subscribe();
     }
  }
}
