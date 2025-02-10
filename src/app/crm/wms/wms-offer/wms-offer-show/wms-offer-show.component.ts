import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CommentComponent} from "../../../../utils/comment/comment.component";
import {AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatList, MatListItem} from '@angular/material/list';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable
} from '@angular/material/table';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatDivider} from '@angular/material/divider';
import {BehaviorSubject, catchError, of, tap} from 'rxjs';
import {StorageNeedResponseDto} from '../../../../../dtos/response/crm/storage.need.response.dto';
import {StorageNeedService} from '../../../../../services/crm/wms/storage.need.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageOfferResponseDto} from '../../../../../dtos/response/crm/storage.offer.response.dto';
import {StorageOfferService} from '../../../../../services/crm/wms/storage.offer.service';
import {EntityEnum} from '../../../../../enums/entity.enum';
import {getLabelFromStorageReasonEnum} from '../../../../../enums/crm/storage.reason.enum';
import {DiscountTypeEnum} from '../../../../../enums/discount.type.enum';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-wms-offer-show',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatList,
    MatIcon,
    MatListItem,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    NgIf,
    MatCellDef,
    MatColumnDef,
    MatTable,
    MatCardSubtitle,
    MatCardTitle,
    NgForOf,
    MatIconButton,
    MatExpansionPanelHeader,
    MatExpansionPanel, MatDivider,
    MatExpansionPanelTitle, NgClass, DatePipe, CommentComponent, MatMenu, MatMenuItem, MatMenuTrigger, CurrencyPipe, ReactiveFormsModule, AsyncPipe, MatFormField, MatLabel, MatOption, MatSelect
  ],
  templateUrl: './wms-offer-show.component.html',
  styleUrl: './wms-offer-show.component.css'
})
export class WmsOfferShowComponent  implements OnInit, AfterViewInit{
  storageOffer:BehaviorSubject<StorageOfferResponseDto> = new BehaviorSubject<StorageOfferResponseDto>({} as StorageOfferResponseDto);
  expandedElement: any | null = null;
  disabledEditing: boolean = true;
  unloadingDisplayedColumns: string[] =  [ 'name', "unite","price", "remise", "remiseValue", "finalPrice", "actions",];
  constructor(private storageOfferService: StorageOfferService, public router: Router,private activeRouter: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const storageNeedId:number = this.activeRouter.snapshot.params['id'];
    this.storageOfferService.getStorageOfferById(storageNeedId).pipe(
      tap(data => this.storageOffer.next(data)),
      catchError((err) => {
        this.snackBar.open("Erreur de téléchargement de données", "ok", {duration: 3000})
        return of(null);}
      )).subscribe({
      next:()=> {
        console.log(this.storageOffer.getValue());
      }
    })
  }
  ngAfterViewInit() {

  }

  toggleRow(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  getNeedStatus(status: string): string {
    switch (status){
      case 'CREATION':
        return "Crée"
      default:
        return "N/A"
    }
  }


  createOfferFromNeed() {
    this.router.navigate(['/admin/crm/wms/offers/create'], {state: {data: this.storageOffer.getValue()}})
      .then(() => console.log('Navigation successful'))
      .catch(err => console.error('Navigation error:', err));
  }

  protected readonly EntityEnum = EntityEnum;
  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;
  protected readonly DiscountTypeEnum = DiscountTypeEnum;

}
