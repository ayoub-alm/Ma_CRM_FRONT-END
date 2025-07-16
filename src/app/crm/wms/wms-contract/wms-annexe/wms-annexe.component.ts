import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {GeneralInfosComponent} from "../../../../utils/general-infos/general-infos.component";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {BehaviorSubject, tap} from 'rxjs';
import {StorageDeliveryNoteResponseDto} from '../../../../../dtos/response/crm/storage.delivery.note.response.dto';
import {StorageDeliveryNoteService} from '../../../../../services/crm/wms/storage.delivery.note.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageInvoiceService} from '../../../../../services/crm/wms/storage.invoice.service';
import {StorageContractService} from '../../../../../services/crm/wms/storage.contract.service';
import {StorageContractResponseDto} from '../../../../../dtos/response/crm/storage.contract.response.dto';
import {StorageAnnexeResponseDto} from '../../../../../dtos/response/crm/storage.annexe.response.dto';
import {PrintService} from '../../../../../services/docs/print.service';

@Component({
  selector: 'app-wms-annexe',
  standalone: true,
  imports: [
    DatePipe,
    GeneralInfosComponent,
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatMenu,
    MatMenuItem,
    NgForOf,
    MatMenuTrigger
  ],
  templateUrl: './wms-annexe.component.html',
  styleUrl: './wms-annexe.component.css'
})
export class WmsAnnexeComponent implements OnInit {
annexe: BehaviorSubject<StorageAnnexeResponseDto> = new BehaviorSubject<StorageAnnexeResponseDto>({} as StorageAnnexeResponseDto);
constructor(private contractService: StorageContractService,private activeRouter: ActivatedRoute,
  public router: Router, private snackBar: MatSnackBar, private storageInvoiceService: StorageInvoiceService,
            private printService: PrintService) {
}

ngOnInit() {
  const storageAnnexeId:number = this.activeRouter.snapshot.params['id'];
  this.contractService.getStorageAnnexeById(storageAnnexeId).pipe(tap(storageDeliveryNote => {
    this.annexe.next(storageDeliveryNote);
  })).subscribe()
}

  /**
   * this function allows to download contract Annexe
   */
  onGenerateAnnexDoc() {
    this.printService.generateContractAnnexe(this.annexe.getValue().id);
  }
}
