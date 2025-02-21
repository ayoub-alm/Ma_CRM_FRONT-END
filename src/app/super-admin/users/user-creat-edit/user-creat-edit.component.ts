import {Component, Inject, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserModel} from "../../../models/super-admin/user.model";
import {RoleService} from "../../../services/super-admin/role.service";
import {BehaviorSubject, catchError, of, Subject, takeUntil, tap, throwError} from "rxjs";
import {RoleModel} from "../../../models/super-admin/role.model";
import {RightsService} from "../../../services/super-admin/rights.service";
import {RightsModel} from "../../../models/super-admin/rights.model";
import {subscribe} from "node:diagnostics_channel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../services/super-admin/user.service";

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
        AsyncPipe
    ],
  templateUrl: './user-creat-edit.component.html',
  styleUrl: './user-creat-edit.component.css'
})
export class UserCreatEditComponent implements OnInit{
  userForm!: FormGroup;
  roles: BehaviorSubject<RoleModel[]> = new BehaviorSubject<RoleModel[]>([]);
  rights: BehaviorSubject<RightsModel[]> = new BehaviorSubject<RightsModel[]>([]);
  users: BehaviorSubject<UserModel[]> = new BehaviorSubject<UserModel[]>([]);
  isEditMode: boolean = false;
  // roles: string[] = ['Admin', 'User', 'Manager']; // Sample roles
  // rights = [
  //   { name: 'Read', description: 'Can read data' },
  //   { name: 'Write', description: 'Can write data' },
  //   { name: 'Delete', description: 'Can delete data' }
  // ];

  selectedRole: string | null = null;
  selectedRights: { name: string, description: string }[] = [];
  showRightsPanel = false;

  private destroy$ = new Subject<void>();
  constructor(private fb: FormBuilder, private rightsService: RightsService, private roleService: RoleService, private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: UserModel, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<UserCreatEditComponent>) {
      this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [this.data?.id || null],
      image: [this.data?.image || null],
      name: [this.data?.name || '', Validators.required],
      lastName: [this.data?.lastName || '', Validators.required],
      matricule: [this.data?.matricule || '', Validators.required],
      email: [this.data?.email || '', Validators.required],
      password: [this.data?.password || '', Validators.required],
      aboutMe: [this.data?.aboutMe || '', Validators.required],
      phone: [this.data?.phone || '', Validators.required],
      companyId: [this.data?.companyId || '', Validators.required],
      role: [this.data?.role || null],
      rights: [this.data?.rights || null],
    });

    // fetch role
    this.roleService.getAllRoles().pipe(
        tap(data => {
            this.roles.next(data);
            if (this.data){
              this.userForm.get('companyId')?.setValue(this.data?.companyId)
            }
        }),
    takeUntil(this.destroy$)
    ).subscribe()

    // fetch rights
    this.rightsService.getAllRights().pipe(
        tap(data => {
          this.rights.next(data);
          if(this.data){
            this.userForm.get('companyId')?.setValue(this.data?.companyId)
          }
        }),
    takeUntil(this.destroy$)
    ).subscribe()

      // subscribe to company changes and select interlocutors based on selected company
      this.userForm.get('companyId')?.valueChanges.pipe(
          tap(value => {
              const selectUsers:  UserModel[] = this.users.getValue().filter((user => user.companyId === value))
              this.users.next(selectUsers)
          })).subscribe();

      // Listen for changes in form fields and auto-generate password
      this.userForm.valueChanges.subscribe(() => {
          this.autoGeneratePassword();
      });

  }

  // create update user
  createOrEditUser(): void{
      if (this.userForm.invalid) {
          this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
          return;
      }
      const rerquest: UserModel = this.userForm.value;

      // Call the service to update the user
      if(this.isEditMode && this.data?.id){
          this.userService.updateUser(this.data.id, rerquest).pipe(
              tap(updateData => {
                  this.snackBar.open(`Entroprise mis à jour : ${updateData.name} ✅`, "Ok", { duration: 3000 });
                  this.dialogRef.close(updateData);
              }),
              catchError((error) => {
                  this.snackBar.open(`Error ${error.message} ⛔`, "Ok", { duration: 3000 });
                  console.error('Error Modifier:', error); // Debugging statement
                  return of(null)
              })
          ).subscribe();
      } else {
          // Call the service to create the user
          this.userService.createUser(rerquest).pipe(
              tap(createUser => {
                  this.snackBar.open(`Entroprise créé avec succès ✅`, "Ok", { duration: 3000 });
                  this.dialogRef.close(createUser); // Explicitly return the new data
              }),catchError((error) => {
                  this.snackBar.open(`Error creating Entroprise: ${error} ⛔`, "Ok", { duration: 3000 });
                  console.error("Error creating Company: ", error);
                  return throwError(error);
              })
          ).subscribe();
      }
  }

  // Handle exclusive role selection
  onRoleSelect(event: any) {
    this.selectedRole = event.value;
    this.userForm.patchValue({ role: event.value });
  }

  // Toggle rights panel
  toggleRightsPanel() {
    this.showRightsPanel = !this.showRightsPanel;
  }

  // Add a right to the user
  addRight(right: { name: string, description: string }) {
    if (!this.selectedRights.some(r => r.name === right.name)) {
      this.selectedRights.push(right);
      this.userForm.patchValue({ rights: this.selectedRights });
    }
  }

  // Remove a right from the user
  removeRight(right: { name: string, description: string }) {
    this.selectedRights = this.selectedRights.filter(r => r.name !== right.name);
    this.userForm.patchValue({ rights: this.selectedRights });
  }

  // 🔐 Generate password when type first name and last name
    autoGeneratePassword(): void {
        const firstName = this.userForm.get('name')?.value || '';
        const lastName = this.userForm.get('lastName')?.value || '';
        const year = new Date().getFullYear(); // Get current year

        const password = this.generatePassword(firstName, lastName, year);
        this.userForm.get('password')?.setValue(password, { emitEvent: false }); // Avoid infinite loop
    }

    generatePassword(firstName: string, lastName: string, year: number): string {
        const firstLetterFirstName = firstName.charAt(0).toUpperCase();
        const firstLetterLastName = lastName.charAt(0).toUpperCase();

        return `${firstLetterFirstName}${firstLetterLastName}${year}`;
    }
    
}
