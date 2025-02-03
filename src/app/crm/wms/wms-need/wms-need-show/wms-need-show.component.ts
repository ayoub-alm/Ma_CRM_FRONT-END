import {AfterViewInit, Component, OnInit} from '@angular/core';
import {StorageNeedService} from '../../../../../services/crm/wms/storage.need.service';
import {BehaviorSubject, catchError, of, tap} from 'rxjs';
import {StorageNeedResponseDto} from '../../../../../dtos/response/crm/storage.need.response.dto';
import {ActivatedRoute, Router, RouterLinkActive, RouterModule} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatList, MatListItem} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable
} from '@angular/material/table';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatDivider} from '@angular/material/divider';
import {getLabelFromStorageReasonEnum} from '../../../../../enums/crm/storage.reason.enum';
import {CommentComponent} from '../../../../utils/comment/comment.component';
import {EntityEnum} from '../../../../../enums/entity.enum';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-wms-need-show',
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
    MatExpansionPanelTitle, NgClass, DatePipe, CommentComponent, MatMenu, MatMenuItem, MatMenuTrigger
  ],
  templateUrl: './wms-need-show.component.html',
  styleUrl: './wms-need-show.component.css'
})
export class WmsNeedShowComponent implements OnInit, AfterViewInit{
  storageNeed:BehaviorSubject<StorageNeedResponseDto> = new BehaviorSubject<StorageNeedResponseDto>({} as StorageNeedResponseDto);
  expandedElement: any | null = null;
  constructor(private storageNeedService: StorageNeedService, public router: Router,private activeRouter: ActivatedRoute,
  private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const storageNeedId:number = this.activeRouter.snapshot.params['id'];
    this.storageNeedService.getStorageNeedById(storageNeedId).pipe(
      tap(data => this.storageNeed.next(data)),
      catchError((err) => {
        this.snackBar.open("Erreur de téléchargement de données", "ok", {duration: 3000})
        return of(null);}
      )).subscribe({
      next:()=> {
        console.log(this.storageNeed.getValue());
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

  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;
  protected readonly EntityEnum = EntityEnum;

  createOfferFromNeed() {
    this.router.navigate(['/admin/crm/wms/offers/create'], {state: {data: this.storageNeed.getValue()}})
      .then(() => console.log('Navigation successful'))
      .catch(err => console.error('Navigation error:', err));
  }
}
