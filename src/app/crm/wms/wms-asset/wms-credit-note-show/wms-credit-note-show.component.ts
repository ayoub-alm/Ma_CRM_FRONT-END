import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {GeneralInfosComponent} from '../../../../utils/general-infos/general-infos.component';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {BehaviorSubject, debounceTime, distinctUntilChanged, finalize, tap} from 'rxjs';
import {StorageDeliveryNoteResponseDto} from '../../../../../dtos/response/crm/storage.delivery.note.response.dto';
import {StorageDeliveryNoteService} from '../../../../../services/crm/wms/storage.delivery.note.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageInvoiceService} from '../../../../../services/crm/wms/storage.invoice.service';
import {MatDialog} from '@angular/material/dialog';
import {StorageCreditNoteResponseDto} from '../../../../../dtos/response/crm/storage.credit.note.response.dto';
import {StorageCreditNoteService} from '../../../../../services/crm/wms/storage.credit.note.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {PrintService} from '../../../../../services/docs/print.service';

@Component({
  selector: 'app-wms-credit-note-show',
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
    MatMenuTrigger,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './wms-credit-note-show.component.html',
  styleUrl: './wms-credit-note-show.component.css'
})
export class WmsCreditNoteShowComponent implements OnInit, AfterViewInit {
  isEditing: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);
  creditNote: BehaviorSubject<StorageCreditNoteResponseDto> = new BehaviorSubject<StorageCreditNoteResponseDto>({} as StorageCreditNoteResponseDto);
  creditNoteForm!: FormGroup;
  constructor(private creditNoteService: StorageCreditNoteService, private activeRouter: ActivatedRoute,
              public router: Router, private snackBar: MatSnackBar, private storageInvoiceService: StorageInvoiceService,
              private dialog: MatDialog,private fb: FormBuilder, private printService: PrintService) {
    this.creditNoteForm = this.fb.group({
      id:[this.creditNote.getValue().id, Validators.required],
      sendDate:[this.creditNote.getValue().sendDate, Validators.required],
      sendStatus:[this.creditNote.getValue().sendStatus, Validators.required],
      returnDate:[this.creditNote.getValue().returnDate, Validators.required],
      returnStatus:[this.creditNote.getValue().returnStatus, Validators.required],
      totalHt:[this.creditNote.getValue().totalHt, Validators.required],
    })
  }

  ngOnInit() {
    this.loadDeliveryNote();
    this.listenToChangesInFormAndUpdateData();
  }
  ngAfterViewInit() {
    this.creditNoteForm.patchValue(this.creditNote.getValue())
  }

  /**
   *
   */
  loadDeliveryNote() {
    const storageCreditNoteId: number = this.activeRouter.snapshot.params['id'];
    this.creditNoteService.getStorageCreditNoteById(storageCreditNoteId).pipe(tap(storageDeliveryNote => {
      this.creditNote.next(storageDeliveryNote);
    })).subscribe()

    if (this.creditNote.getValue().status && this.creditNote.getValue().status.id > 1) {
      this.isEditing.next(false);
    }
  }

  /**
   *
   */
  listenToChangesInFormAndUpdateData(){
    this.creditNoteForm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(data => {
        this.creditNoteService.updateStorageCreditNote(this.creditNoteForm.value).pipe(
          tap(data => this.creditNote.next(data)),
        ).subscribe();
      })
    ).subscribe();
  }


  onDownLoadCreditNote() {
    this.printService.generateStorageCreditNote(this.creditNote.getValue().id)
  }
}
