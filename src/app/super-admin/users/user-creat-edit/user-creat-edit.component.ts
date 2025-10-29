import {Component, Inject, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {UserModel} from "../../../models/super-admin/user.model";
import {RoleService} from "../../../services/super-admin/role.service";
import {BehaviorSubject, catchError, of, Subject, takeUntil, tap, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../services/super-admin/user.service";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {PaymentMethodResponseDto} from '../../../../dtos/init_data/response/paymentMethodResponseDto';
import {StorageInvoicePaymentService} from '../../../../services/crm/wms/storage.invoice.payment.service';
import {PaymentMethodService} from '../../../../services/data/payemet.method.service';
import {StorageInvoicePaymentRequestDto} from '../../../../dtos/request/crm/storage.invoice.payment.request.dto';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-user-creat-edit',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    NgForOf,
    NgIf,
    MatButton,
    MatIconButton,
    MatError,
    MatChipsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatSuffix
  ],
  templateUrl: './user-creat-edit.component.html',
  styleUrl: './user-creat-edit.component.css',
  providers: [provideNativeDateAdapter()],
})
export class UserCreatEditComponent  implements OnInit{
  public userForm!: FormGroup;
  paymentMethos: BehaviorSubject<PaymentMethodResponseDto[]> = new BehaviorSubject<PaymentMethodResponseDto[]>([])
  constructor(private dialogRef: MatDialogRef<UserCreatEditComponent>,@Inject(MAT_DIALOG_DATA)private data: any,
              private paymentService: StorageInvoicePaymentService, private fb: FormBuilder, private paymentMethodService: PaymentMethodService,
              private snackBar: MatSnackBar) {
    this.userForm =  this.fb.group({
      name: ["", Validators.required],
      lastName: ["", Validators.required],
      email:["", Validators.required],
      phone:["", Validators.required],
      password:["", Validators.required],
      passwordConfirm:["", Validators.required],
    })
  }

  ngOnInit() {
    this.paymentMethodService.getAllPaymentMethods().pipe(
      tap(data => this.paymentMethos.next(data))
    ).subscribe()
  }

  /**
   * this function allows to create a new payment method
   */
  addPayment() {
    this.userForm.get("invoiceId")?.setValue(this.data.id)
    this.userForm.markAllAsTouched();
    console.log(this.userForm.value);
    if (this.userForm.valid) {
      const payment = new StorageInvoicePaymentRequestDto(this.userForm.value);
      this.paymentService.createStorageInvoicePayment(payment).
      pipe(tap(data => {
          this.snackBar.open("Le piemnt a été bien Ajouté", "ok", {duration: 3000})
          this.dialogRef.close();
        })
      ).subscribe()
    }else{
      this.snackBar.open("Merci de saisaire des donées valide ", "Ok", {duration:3000, panelClass:["text-danger"]})
    }
  }
}

// implements OnInit{
  // userForm!: FormGroup;
  // roles: BehaviorSubject<RoleModel[]> = new BehaviorSubject<RoleModel[]>([]);
  // rights: BehaviorSubject<RightsModel[]> = new BehaviorSubject<RightsModel[]>([]);
  // users: BehaviorSubject<UserModel[]> = new BehaviorSubject<UserModel[]>([]);
  // isEditMode: boolean = false;
  // // roles: string[] = ['Admin', 'User', 'Manager']; // Sample roles
  // // rights = [
  // //   { name: 'Read', description: 'Can read data' },
  // //   { name: 'Write', description: 'Can write data' },
  // //   { name: 'Delete', description: 'Can delete data' }
  // // ];
  //
  // selectedRole: string | null = null;
  // selectedRights: { name: string, description: string }[] = [];
  // showRightsPanel = false;
  //
  // private destroy$ = new Subject<void>();
  // constructor(private fb: FormBuilder, private rightsService: RightsService, private roleService: RoleService, private userService: UserService,
  //             @Inject(MAT_DIALOG_DATA) public data: UserModel, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<UserCreatEditComponent>) {
  //     this.isEditMode = !!data;
  // }
  //
  // ngOnInit(): void {
  //   this.userForm = this.fb.group({
  //     id: [this.data?.id || null],
  //     image: [this.data?.image || null],
  //     name: [this.data?.name || '', Validators.required],
  //     lastName: [this.data?.lastName || '', Validators.required],
  //     matricule: [this.data?.matricule || '', Validators.required],
  //     email: [this.data?.email || '', Validators.required],
  //     password: [this.data?.password || '', Validators.required],
  //     aboutMe: [this.data?.aboutMe || '', Validators.required],
  //     phone: [this.data?.phone || '', Validators.required],
  //     companyId: [this.data?.companyId || '', Validators.required],
  //     role: [this.data?.role || null],
  //     rights: [this.data?.rights || null],
  //   });
  //
  //   // fetch role
  //   this.roleService.getAllRoles().pipe(
  //       tap(data => {
  //           this.roles.next(data);
  //           if (this.data){
  //             this.userForm.get('companyId')?.setValue(this.data?.companyId)
  //           }
  //       }),
  //   takeUntil(this.destroy$)
  //   ).subscribe()
  //
  //   // fetch rights
  //   this.rightsService.getAllRights().pipe(
  //       tap(data => {
  //         this.rights.next(data);
  //         if(this.data){
  //           this.userForm.get('companyId')?.setValue(this.data?.companyId)
  //         }
  //       }),
  //   takeUntil(this.destroy$)
  //   ).subscribe()
  //
  //     // subscribe to company changes and select interlocutors based on selected company
  //     this.userForm.get('companyId')?.valueChanges.pipe(
  //         tap(value => {
  //             const selectUsers:  UserModel[] = this.users.getValue().filter((user => user.companyId === value))
  //             this.users.next(selectUsers)
  //         })).subscribe();
  //
  //     // Listen for changes in form fields and auto-generate password
  //     this.userForm.valueChanges.subscribe(() => {
  //         this.autoGeneratePassword();
  //     });
  //
  // }
  //
  // // create update user
  // createOrEditUser(): void{
  //     if (this.userForm.invalid) {
  //         this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
  //         return;
  //     }
  //     const rerquest: UserModel = this.userForm.value;
  //
  //     // Call the service to update the user
  //     if(this.isEditMode && this.data?.id){
  //         this.userService.updateUser(this.data.id, rerquest).pipe(
  //             tap(updateData => {
  //                 this.snackBar.open(`Entroprise mis à jour : ${updateData.name} ✅`, "Ok", { duration: 3000 });
  //                 this.dialogRef.close(updateData);
  //             }),
  //             catchError((error) => {
  //                 this.snackBar.open(`Error ${error.message} ⛔`, "Ok", { duration: 3000 });
  //                 console.error('Error Modifier:', error); // Debugging statement
  //                 return of(null)
  //             })
  //         ).subscribe();
  //     } else {
  //         // Call the service to create the user
  //         this.userService.createUser(rerquest).pipe(
  //             tap(createUser => {
  //                 this.snackBar.open(`Entroprise créé avec succès ✅`, "Ok", { duration: 3000 });
  //                 this.dialogRef.close(createUser); // Explicitly return the new data
  //             }),catchError((error) => {
  //                 this.snackBar.open(`Error creating Entroprise: ${error} ⛔`, "Ok", { duration: 3000 });
  //                 console.error("Error creating Company: ", error);
  //                 return throwError(error);
  //             })
  //         ).subscribe();
  //     }
  // }
  //
  // // Handle exclusive role selection
  // onRoleSelect(event: any) {
  //   this.selectedRole = event.value;
  //   this.userForm.patchValue({ role: event.value });
  // }
  //
  // // Toggle rights panel
  // toggleRightsPanel() {
  //   this.showRightsPanel = !this.showRightsPanel;
  // }
  //
  // // Add a right to the user
  // addRight(right: { name: string, description: string }) {
  //   if (!this.selectedRights.some(r => r.name === right.name)) {
  //     this.selectedRights.push(right);
  //     this.userForm.patchValue({ rights: this.selectedRights });
  //   }
  // }
  //
  // // Remove a right from the user
  // removeRight(right: { name: string, description: string }) {
  //   this.selectedRights = this.selectedRights.filter(r => r.name !== right.name);
  //   this.userForm.patchValue({ rights: this.selectedRights });
  // }
  //
  // // 🔐 Generate password when type first name and last name
  //   autoGeneratePassword(): void {
  //       const firstName = this.userForm.get('name')?.value || '';
  //       const lastName = this.userForm.get('lastName')?.value || '';
  //       const year = new Date().getFullYear(); // Get current year
  //
  //       const password = this.generatePassword(firstName, lastName, year);
  //       this.userForm.get('password')?.setValue(password, { emitEvent: false }); // Avoid infinite loop
  //   }
  //
  //   generatePassword(firstName: string, lastName: string, year: number): string {
  //       const firstLetterFirstName = firstName.charAt(0).toUpperCase();
  //       const firstLetterLastName = lastName.charAt(0).toUpperCase();
  //
  //       return `${firstLetterFirstName}${firstLetterLastName}${year}`;
  //   }
  //

