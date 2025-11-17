import {Component, Inject, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatTooltipModule} from "@angular/material/tooltip";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {UserModel} from "../../../models/super-admin/user.model";
import {RoleService} from "../../../services/super-admin/role.service";
import {RightsService} from "../../../services/super-admin/rights.service";
import {BehaviorSubject, catchError, of, Subject, takeUntil, tap, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../services/super-admin/user.service";
import {RoleModel} from "../../../models/super-admin/role.model";
import {RightsModel} from "../../../models/super-admin/rights.model";
import {CompanyService} from "../../../../services/company.service";
import {CompanyResponseDto} from "../../../../dtos/response/CompanyResponseDto";

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
    AsyncPipe,
    MatButton,
    MatIconButton,
    MatError,
    MatChipsModule,
    MatTooltipModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatSuffix
  ],
  templateUrl: './user-creat-edit.component.html',
  styleUrl: './user-creat-edit.component.css',
})
export class UserCreatEditComponent implements OnInit {
  public userForm!: FormGroup;
  roles: BehaviorSubject<RoleModel[]> = new BehaviorSubject<RoleModel[]>([]);
  rights: BehaviorSubject<RightsModel[]> = new BehaviorSubject<RightsModel[]>([]);
  companies: BehaviorSubject<CompanyResponseDto[]> = new BehaviorSubject<CompanyResponseDto[]>([]);
  isEditMode: boolean = false;
  selectedRole: RoleModel | null = null;
  selectedRights: RightsModel[] = [];
  selectedCompanies: CompanyResponseDto[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private rightsService: RightsService,
    private roleService: RoleService,
    private userService: UserService,
    private companyService: CompanyService,
    @Inject(MAT_DIALOG_DATA) public data: UserModel,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserCreatEditComponent>
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [this.data?.id || null],
      name: [this.data?.name || '', Validators.required],
      matriculate: [this.data?.matriculate || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      password: [this.data?.password || '', this.isEditMode ? [] : Validators.required],
      aboutMe: [this.data?.aboutMe || ''],
      phone: [this.data?.phone || '', Validators.required],
      role: [this.data?.role || null, Validators.required],
      rights: [this.data?.rights || []],
      companies: [this.data?.companies?.map(c => c.id) || []],
    });

    // Initialize selected rights if in edit mode
    if (this.isEditMode && this.data?.rights) {
      this.selectedRights = [...this.data.rights];
      this.userForm.patchValue({ rights: this.selectedRights });
    }

    // Initialize selected companies if in edit mode
    if (this.isEditMode && this.data?.companies) {
      const companyIds = this.data.companies.map(c => c.id);
      this.userForm.patchValue({ companies: companyIds });
    }

    // Fetch roles
    this.roleService.getAllRoles().pipe(
      tap(data => {
        this.roles.next(data);
        if (this.data?.role) {
          this.userForm.get('role')?.setValue(this.data.role);
          this.selectedRole = this.data.role;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    // Fetch rights
    this.rightsService.getAllRights().pipe(
      tap(data => {
        this.rights.next(data);
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    // Fetch companies
    this.companyService.getAllCompanies().pipe(
      tap(data => {
        this.companies.next(data);
        // If in edit mode, set selected companies
        if (this.isEditMode && this.data?.companies) {
          const companyIds = this.data.companies.map(c => c.id);
          const selectedCompanies = data.filter(c => companyIds.includes(c.id));
          this.selectedCompanies = selectedCompanies;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    // Listen to rights changes
    this.userForm.get('rights')?.valueChanges.pipe(
      tap(() => this.onRightsChange()),
      takeUntil(this.destroy$)
    ).subscribe();

    // Listen for changes in form fields and auto-generate password
    if (!this.isEditMode) {
      this.userForm.get('name')?.valueChanges.subscribe(() => {
        this.autoGeneratePassword();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Create or update user
  createOrEditUser(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.', 'Fermer', { duration: 3000 });
      return;
    }

    const formValue = this.userForm.value;
    // Get selected company models
    const selectedCompanyIds = formValue.companies || [];
    const selectedCompanyModels = this.companies.getValue()
      .filter(c => selectedCompanyIds.includes(c.id))
      .map(c => ({ id: c.id, name: c.name } as any));

    // Extract role model - formValue.role is already a RoleModel from the select
    const roleModel = formValue.role as RoleModel | null;

    // Extract right models - formValue.rights is already an array of RightsModel from the select
    const rightModels = (formValue.rights || []) as RightsModel[];

    const request: UserModel = new UserModel({
      id: formValue.id,
      logo: '', // Logo removed from user creation
      name: formValue.name,
      matriculate: formValue.matriculate,
      email: formValue.email,
      password: formValue.password,
      aboutMe: formValue.aboutMe || '',
      phone: formValue.phone,
      role: roleModel,
      rights: rightModels,
      companies: selectedCompanyModels
    });

    // Call the service to update the user
    if (this.isEditMode && this.data?.id) {
      this.userService.updateUser(this.data.id, request).pipe(
        tap(updateData => {
          this.snackBar.open(`Utilisateur mis à jour : ${updateData.name} ✅`, "Ok", { duration: 3000 });
          this.dialogRef.close(updateData);
        }),
        catchError((error) => {
          this.snackBar.open(`Erreur lors de la mise à jour: ${error.message} ⛔`, "Ok", { duration: 3000 });
          console.error('Error updating user:', error);
          return of(null);
        })
      ).subscribe();
    } else {
      // Call the service to create the user
      this.userService.createUser(request).pipe(
        tap(createUser => {
          this.snackBar.open(`Utilisateur créé avec succès ✅`, "Ok", { duration: 3000 });
          this.dialogRef.close(createUser);
        }),
        catchError((error) => {
          this.snackBar.open(`Erreur lors de la création: ${error.message} ⛔`, "Ok", { duration: 3000 });
          console.error("Error creating user: ", error);
          return throwError(() => error);
        })
      ).subscribe();
    }
  }

  // Handle role selection
  onRoleSelect(event: any) {
    const selectedRole = event.value;
    this.selectedRole = selectedRole;
    this.userForm.patchValue({ role: selectedRole });
  }

  // Handle rights selection change
  onRightsChange() {
    const selectedRights = this.userForm.get('rights')?.value || [];
    this.selectedRights = selectedRights;
  }

  // Remove a right from the user
  removeRight(right: RightsModel) {
    const currentRights = this.userForm.get('rights')?.value || [];
    const updatedRights = currentRights.filter((r: RightsModel) => r.id !== right.id);
    this.userForm.patchValue({ rights: updatedRights });
    this.selectedRights = updatedRights;
  }

  // Handle companies selection change
  onCompaniesChange() {
    const selectedCompanyIds = this.userForm.get('companies')?.value || [];
    const selectedCompanies = this.companies.getValue().filter(c => selectedCompanyIds.includes(c.id));
    this.selectedCompanies = selectedCompanies;
  }

  // Remove a company from the user
  removeCompany(company: CompanyResponseDto) {
    const currentCompanyIds = this.userForm.get('companies')?.value || [];
    const updatedCompanyIds = currentCompanyIds.filter((id: number) => id !== company.id);
    this.userForm.patchValue({ companies: updatedCompanyIds });
    this.onCompaniesChange();
  }

  // Generate password when typing name
  autoGeneratePassword(): void {
    const name = this.userForm.get('name')?.value || '';
    const year = new Date().getFullYear();

    if (name) {
      const password = this.generatePassword(name, year);
      this.userForm.get('password')?.setValue(password, { emitEvent: false });
    }
  }

  generatePassword(name: string, year: number): string {
    const firstLetter = name.charAt(0).toUpperCase();
    return `${firstLetter}${year}`;
  }

}
