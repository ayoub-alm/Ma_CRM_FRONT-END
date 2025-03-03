import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import {BehaviorSubject, catchError, of, tap} from 'rxjs';
import {ProspectResponseDto} from '../../../../../dtos/response/prospect.response.dto';
import {ProspectService} from '../../../../../services/Leads/prospect.service';
import {StorageContractService} from '../../../../../services/crm/wms/storage.contract.service';
import {StorageContractResponseDto} from '../../../../../dtos/response/crm/storage.contract.response.dto';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent} from '@angular/material/card';
import {DiscountTypeEnum} from '../../../../../enums/discount.type.enum';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {LocalStorageService} from '../../../../../services/local.storage.service';


interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

@Component({
  selector: 'app-wms-invoice-create',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    MatSuffix,
    MatButton,
    MatIcon,
    MatIconButton,
    MatCard,
    MatCardContent,
    CurrencyPipe,
    NgIf,
    NgClass,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatMenu,
    MatMenuItem,
    MatRow,
    MatRowDef,
    MatTable,
    MatMenuTrigger,
    MatHeaderCellDef
  ],
  templateUrl: './wms-invoice-create.component.html',
  styleUrl: './wms-invoice-create.component.css',
  providers: [provideNativeDateAdapter()],
})
export class WmsInvoiceCreateComponent implements OnInit{
  customers: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([]);
  customerFrom!: FormGroup;
  contract: BehaviorSubject<StorageContractResponseDto[]> =  new BehaviorSubject<StorageContractResponseDto[]>([])
  selectedContract: BehaviorSubject<StorageContractResponseDto> =  new BehaviorSubject<StorageContractResponseDto>({} as StorageContractResponseDto);
  displayedColumns: string[] =  ['name',"unite","price","finalPrice", "quantity"];
  invoiceNumber: string = '';
  customerName: string = '';
  invoiceDate: string = new Date().toISOString().split('T')[0];
  expandedElement: any | null = null;
  items: InvoiceItem[] = [
    { description: '', quantity: 1, unitPrice: 0, total: 0 }
  ];

  constructor(private customersService: ProspectService, private fb: FormBuilder, private contractService: StorageContractService,
              private localStorageService: LocalStorageService) {
    this.customerFrom = this.fb.group({
      costumerId: ["", Validators.required],
      contractId: ["", Validators.required],
    })
  }


  ngOnInit() {
    this.loadCostumers();
    this.listenToCustomerChange();
    this.listenToContractChanges();
  }


  /**
   * this function allows to load costumers-prospects
   */
  loadCostumers(): void{
    this.customersService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(
      tap(data => this.customers.next(data)),
      catchError(err => {
        console.error(err)
        return of(null)
      })
    ).subscribe()
  }

  /**
   *
   */
  listenToCustomerChange(){
    this.customerFrom.get('costumerId')?.valueChanges.pipe(
      tap(customerId => {
        this.getContractByCustomerId(customerId);
      })
    ).subscribe()
  }

  listenToContractChanges(){
    this.customerFrom.get('contractId')?.valueChanges.pipe(
      tap(contractId => {
        const contract = this.contract.getValue().find(contract => contract.id === contractId);
        if (contract){
          this.selectedContract.next(contract);
          console.log(this.selectedContract.getValue());
        }
      })
    ).subscribe()
  }

  /**
   *
   * @param customerId
   */
  getContractByCustomerId(customerId: number){
    this.contractService.getStorageContractByCustomerId(customerId).pipe(
      tap(contract => {
       this.contract.next(contract);
      })
    ).subscribe();
  }


  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  get tax(): number {
    return this.subtotal * 0.2; // 10% tax
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  addItem() {
    this.items.push({ description: '', quantity: 1, unitPrice: 0, total: 0 });
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  updateTotal(item: InvoiceItem) {
    item.total = item.quantity * item.unitPrice;
  }

  generatePDF() {
    // const doc = new jsPDF();
    // doc.text('Invoice', 90, 10);
    //
    // doc.text(`Invoice No: ${this.invoiceNumber}`, 10, 20);
    // doc.text(`Customer: ${this.customerName}`, 10, 30);
    // doc.text(`Date: ${this.invoiceDate}`, 10, 40);
    //
    // autoTable(doc, {
    //   startY: 50,
    //   head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    //   body: this.items.map(item => [item.description, item.quantity, item.unitPrice, item.total])
    // });
    //
    // // doc.text(`Subtotal: $${this.subtotal.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
    // // doc.text(`Tax (10%): $${this.tax.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 20);
    // // doc.text(`Total: $${this.total.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 30);
    //
    // doc.save('invoice.pdf');
  }

  protected readonly DiscountTypeEnum = DiscountTypeEnum;
}
