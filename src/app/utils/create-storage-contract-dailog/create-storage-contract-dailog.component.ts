import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {ConfirmationDialogData} from '../confirmation-dialog/confirmation-dialog.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {PaginatorModule} from 'primeng/paginator';
import {ReactiveFormsModule} from '@angular/forms';
import {BehaviorSubject, tap} from 'rxjs';
import {StorageContractResponseDto} from '../../../dtos/response/crm/storage.contract.response.dto';
import {StorageContractService} from '../../../services/crm/wms/storage.contract.service';
import {PrintService} from '../../../services/docs/print.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
export interface CreateStorageContractData{
  customerId:number;
  offerId:number;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  hasActiveContract:boolean;
}
@Component({
  selector: 'app-create-storage-contract-dailog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    PaginatorModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './create-storage-contract-dailog.component.html',
  styleUrl: './create-storage-contract-dailog.component.css'
})
export class CreateStorageContractDialogComponent {
  contracts: BehaviorSubject<StorageContractResponseDto[]> = new BehaviorSubject<StorageContractResponseDto[]>([]);
  selectedContract: BehaviorSubject<StorageContractResponseDto> = new BehaviorSubject<StorageContractResponseDto>({} as StorageContractResponseDto);
  isShowSelectContract: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedContractId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(
    public dialogRef: MatDialogRef<CreateStorageContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateStorageContractData,
    private storageContractService: StorageContractService,
    private printService: PrintService,
    private snackBar:MatSnackBar,
    private router: Router
  ) {}

  /**
   *
   */
  onCancel() {
    if (this.data.hasActiveContract) {
      this.storageContractService.getStorageContractByCustomerId(this.data.customerId).subscribe(contracts => {
        this.contracts.next(contracts);
        this.isShowSelectContract.next(true);
      });
    }else {
      this.dialogRef.close(false);
    }
  }

  /**
   *
   * @param contract
   */
  onSelectContract(contract:StorageContractResponseDto):void{
    console.log(contract.id)
    this.selectedContractId.next(contract.id);
    this.selectedContract.next(contract)
  }

  /**
   * this function allows to create contract annexe and navigate to concerned contract
   */
  onCreateAnnexe() {
    this.storageContractService.createStorageContractAnnexeFromOffer(this.data.offerId,this.selectedContractId.getValue())
      .pipe(tap(data  => {
        this.printService.generateContractAnnexe(data.id);
        this.snackBar.open("Anexxe a ete crée avec success", "OK", {duration:3000});
        this.router.navigateByUrl(`/admin/crm/wms/contracts/show/${data.id}`).then( );
      })).subscribe()
  }
}
