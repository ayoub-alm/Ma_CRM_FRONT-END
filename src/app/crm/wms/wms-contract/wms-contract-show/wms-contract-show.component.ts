import {AfterViewInit, Component, OnInit} from '@angular/core';
import { CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable
} from '@angular/material/table';
import {BehaviorSubject, catchError, debounceTime, distinctUntilChanged, EMPTY, of, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EntityEnum} from '../../../../../enums/entity.enum';
import {getLabelFromStorageReasonEnum} from '../../../../../enums/crm/storage.reason.enum';
import {DiscountTypeEnum} from '../../../../../enums/discount.type.enum';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {StorageContractService} from '../../../../../services/crm/wms/storage.contract.service';
import {StorageContractResponseDto} from '../../../../../dtos/response/crm/storage.contract.response.dto';
import {GeneralInfosComponent} from '../../../../utils/general-infos/general-infos.component';
import {PrintService} from '../../../../../services/docs/print.service';
import {ContractDTO, LineItem} from '../../../../../services/docs/contract.dto';
import {StorageContractUpdateDto} from '../../../../../dtos/request/crm/storage.contract.update.dto';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {UploadFileComponent} from '../../../../utils/upload-file/upload-file.component';
import {LivreEnum} from "../../../../../enums/crm/livre.enum";
import {PaymentMethodResponseDto} from '../../../../../dtos/init_data/response/paymentMethodResponseDto';
import {PaymentMethodService} from '../../../../../services/data/payemet.method.service';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-wms-contract-show',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
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
    NgForOf,
    MatIconButton,
    MatMenu, MatMenuItem, MatMenuTrigger, CurrencyPipe, ReactiveFormsModule, GeneralInfosComponent
    , MatFormField, MatInput, MatLabel, UploadFileComponent, MatSlideToggle, TranslatePipe
  ],
  templateUrl: './wms-contract-show.component.html',
  styleUrl: './wms-contract-show.component.css'
})
export class WmsContractShowComponent  implements OnInit, AfterViewInit{
  protected readonly EntityEnum = EntityEnum;
  protected readonly getLabelFromStorageReasonEnum = getLabelFromStorageReasonEnum;
  protected readonly DiscountTypeEnum = DiscountTypeEnum;

  storageContract:BehaviorSubject<StorageContractResponseDto> = new BehaviorSubject<StorageContractResponseDto>({} as StorageContractResponseDto);
  disabledEditing: boolean = true;
  displayedColumns: string[] =  [ 'name', "unite",
    // "price", "remise", "remiseValue",
    "finalPrice",];
  storageContractForm!:FormGroup;
  paymentMethod: BehaviorSubject<PaymentMethodResponseDto[]> =  new BehaviorSubject<PaymentMethodResponseDto[]>([]);
  constructor(private storageContractService: StorageContractService, public router: Router,private activeRouter: ActivatedRoute,
              private snackBar: MatSnackBar, private printService: PrintService, private fb: FormBuilder,
              private paymentMethodService: PaymentMethodService) {
  }

  ngOnInit() {
    this.storageContractForm = this.fb.group({
      id: ["", Validators.required],
      startDate: ["", Validators.required],
      initialDate: ["", Validators.required],
      noticePeriod: ["", Validators.required],
      declaredValueOfStock: ["", Validators.required],
      insuranceValue: ["", Validators.required],
      paymentMethodId: [""],
      paymentDeadline: [""],
      automaticRenewal:[""]
    })

    this.loadStorageContract();

    this.paymentMethodService.getAllPaymentMethods().subscribe(data => {
      this.paymentMethod.next(data);
    })
  }


  loadStorageContract():void{
    const storageNeedId:number = this.activeRouter.snapshot.params['id'];
    this.storageContractService.getStorageContractById(storageNeedId).pipe(
      tap(data => this.storageContract.next(data)),
      catchError((err) => {
        this.snackBar.open("Erreur de téléchargement de données", "ok", {duration: 3000})
        return of(null);}
      )).subscribe({
      next:()=> {
        console.log(this.storageContract.getValue());
      }
    })
  }
  /**
   *
   */
  ngAfterViewInit() {
    this.storageContractForm.patchValue(this.storageContract.getValue());
    this.storageContractForm.get('id')?.setValue(this.storageContract.getValue().id);
    this.storageContractForm.get('paymentMethodId')?.setValue(this.storageContract.getValue().paymentType.id);

    this.storageContractForm.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000)
    ).subscribe(data => {
      const updateDate = new StorageContractUpdateDto(
        this.storageContract.getValue().id,
        this.storageContractForm.get('startDate')?.value,
        this.storageContractForm.get('initialDate')?.value,
        this.storageContractForm.get('noticePeriod')?.value,
        this.storageContractForm.get('declaredValueOfStock')?.value,
        this.storageContractForm.get('insuranceValue')?.value,
        this.storageContractForm.get('paymentDeadline')?.value,
        this.storageContractForm.get('paymentMethodId')?.value,
        this.storageContractForm.get('automaticRenewal')?.value
      )

      this.storageContractService.updateStorageContract(updateDate).pipe(
        tap(data => {
          this.storageContract.next(data);
          this.snackBar.open("La modification a été bien effectuén ", "OK", {duration:3000});
        }),
        catchError(err => {
          this.snackBar.open("Error lors de la modification ", "OK", {duration:3000});
          return EMPTY;
        })
      ).subscribe();
    })
  }



  /**
   *
   */
  generateContractDocx() {
      this.printService.generateContractById(this.storageContract.getValue().id)
  }

  onUploadComplete($event: boolean) {
    if ($event){
     this.loadStorageContract();
    }
  }

  /**
   * this function allows to show Annexe form storage contract
   * @param id The id of annexe
   */
  showStorageAnnexe(id: number) {
    this.storageContractService.getStorageAnnexeById(id).subscribe();
  }
}

