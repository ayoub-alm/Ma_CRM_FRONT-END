import {Component, Inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InterlocutorRequestDto} from '../../../../dtos/request/leads/interlocutorRequestDto';
import {InterlocutorService} from '../../../../services/Leads/interlocutor.service';
import {BehaviorSubject, catchError, of, tap, throwError} from 'rxjs';
import {PhoneDto} from '../../../../dtos/response/phone.dto';
import {EmailDto} from '../../../../dtos/response/email.dto';
import {ActiveEnum} from '../../../../enums/active.enum';
import {JobTitleService} from '../../../../services/data/job.title.service';
import {JobTitleResponseDto} from '../../../../dtos/init_data/response/job.title.response.dto';
import {ProspectResponseDto} from '../../../../dtos/response/prospect.response.dto';
import {ProspectService} from '../../../../services/Leads/prospect.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {InterlocutorResDto} from '../../../../dtos/response/interlocutor.dto';
import {DepartmentService} from '../../../../services/data/department.service';
import {DepartmentModel} from '../../../../models/department.model';
import {LocalStorageService} from '../../../../services/local.storage.service';

@Component({
  selector: 'app-add-update-interlocutor',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatSlideToggle,
    NgIf,
    AsyncPipe,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
  ],
  templateUrl: './add-update-interlocutor.component.html',
  styleUrl: './add-update-interlocutor.component.css'
})
export class AddUpdateInterlocutorComponent implements OnInit{
  interlocutorForm: FormGroup;
  jobTitles: BehaviorSubject<JobTitleResponseDto[]> = new BehaviorSubject<JobTitleResponseDto[]>([])
  prospects: BehaviorSubject<ProspectResponseDto[]> = new BehaviorSubject<ProspectResponseDto[]>([])
  departments: BehaviorSubject<DepartmentModel[]> = new BehaviorSubject<DepartmentModel[]>([])
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<AddUpdateInterlocutorComponent>,
    @Inject(MAT_DIALOG_DATA) public interlocutorToUpdate: InterlocutorResDto,
    private fb: FormBuilder,
    private interlocutorService: InterlocutorService,
    private jobTileService: JobTitleService,
    private departmentService: DepartmentService,
    private prospectService: ProspectService,
    private snackBar: MatSnackBar,private localStorageService: LocalStorageService
  ) {
    this.interlocutorForm = this.fb.group({
      fullName: new FormControl("", [Validators.required, Validators.minLength(3)]),
      phoneNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\+?[0-9]{10,15}$/),
      ]),
      departmentId: new FormControl("",[]),
      prospectId: new FormControl("", [Validators.required]),
      emailAddress: new FormControl("", [Validators.required, Validators.email]),
      jobTitle: new FormControl("", []),
      active: new FormControl(this.interlocutorToUpdate?.active === 'ACTIVE')
    });
  }

  ngOnInit() {

    // fet all job tiles and fill prospect to display it in job titles field
      this.jobTileService.getAllJobTitles().pipe(tap(data => {
        this.jobTitles.next(data);
        // Patch value after job titles are loaded
        if (this.interlocutorToUpdate) {
          this.interlocutorForm.get('jobTitle')?.setValue(this.interlocutorToUpdate.jobTitle.id);
        }
      })).subscribe()
    // fet all prospect and fill prospect to display it in prospects field
    this.prospectService.getAllCustomers(this.localStorageService.getCurrentCompanyId()).pipe(tap(data =>{
      this.prospects.next(data);
      // Patch value after prospects are loaded
      if (this.interlocutorToUpdate) {
        this.interlocutorForm.get('prospectId')?.setValue(this.interlocutorToUpdate.customer.id);
      }
    })).subscribe()

    this.departmentService.getAllDepartment().pipe(tap(data => {
      this.departments.next(data);
      if (this.interlocutorToUpdate){

        this.interlocutorForm.get('departmentId')?.setValue(this.interlocutorToUpdate.department.id);
      }
    })).subscribe()

    if (this.interlocutorToUpdate.id ) {
      this.interlocutorForm.patchValue({
        fullName: this.interlocutorToUpdate.fullName,
        active: this.interlocutorToUpdate.active.toLowerCase() === 'active',
        phoneNumber: this.interlocutorToUpdate.phoneNumber?.number,
        emailAddress: this.interlocutorToUpdate.emailAddress?.address,
        prospectId: this.interlocutorToUpdate.customer.id,
        jobTitle: this.interlocutorToUpdate.jobTitle ? this.interlocutorToUpdate.jobTitle.id : null,
        departmentId: this.interlocutorToUpdate.department ? this.interlocutorToUpdate.department.id : null
      });
    }
  }

  // Method to handle form submission
  createOrUpdateInterlocutor(): void {
    if (this.interlocutorForm.valid) {
      const interlocutorData = this.interlocutorForm.value;
      // check if ID exist , yes ? update the prospect
      if (this.interlocutorToUpdate?.id) {
        // Update logic
        const dto = new InterlocutorRequestDto(
          this.interlocutorToUpdate.id, // id is null for creation
          this.interlocutorForm.get('fullName')?.value, // fullName from the form
          this.interlocutorForm.get('prospectId')?.value, // prospectId from the form
          this.interlocutorForm.get('departmentId')?.value, // Assuming departmentId is optional and can be null
          new PhoneDto(this.interlocutorToUpdate.phoneNumber.id,this.interlocutorForm.get('phoneNumber')?.value), // phoneNumber as a PhoneDto
          new EmailDto(this.interlocutorToUpdate.emailAddress.id,this.interlocutorForm.get('emailAddress')?.value,'default'), // emailAddress as an EmailDto
          this.interlocutorForm.get('jobTitle')?.value, // Assuming jobTitleId is optional and can be null
          this.interlocutorForm.get('active')?.value ? ActiveEnum.ACTIVE : ActiveEnum.INACTIVE // active based on the form value
        );
        this.interlocutorService.updateInterlocutor(this.interlocutorToUpdate.id, dto).pipe(
            tap((updatedData: InterlocutorResDto) => {
              this.snackBar.open(`Interlocuteur mis à jour : ${updatedData.fullName} ✅`, "Ok", { duration: 3000 });
              this.dialogRef.close(updatedData); // Explicitly return the updated data
            }),
            catchError((error) => {
              this.snackBar.open(`Error ${error.message} ⛔`, "Ok", { duration: 3000 });
              console.error('Update Error:', error); // Debugging statement
              return of(null)
            })
        ).subscribe();

      } else {
        // create prospect
        const dto = new InterlocutorRequestDto(
          null, // id is null for creation
          this.interlocutorForm.get('fullName')?.value, // fullName from the form
          this.interlocutorForm.get('prospectId')?.value, // prospectId from the form
          this.interlocutorForm.get('departmentId')?.value, // Assuming departmentId is optional and can be null
          new PhoneDto(null,this.interlocutorForm.get('phoneNumber')?.value), // phoneNumber as a PhoneDto
          new EmailDto(null,this.interlocutorForm.get('emailAddress')?.value,'default'), // emailAddress as an EmailDto
          this.interlocutorForm.get('jobTitle')?.value, // Assuming jobTitleId is optional and can be null
          this.interlocutorForm.get('active')?.value ? ActiveEnum.ACTIVE : ActiveEnum.INACTIVE // active based on the form value
        );

        this.interlocutorService.createInterlocutor(dto).pipe(
            tap((newData) => {
              this.snackBar.open(`Interlocuteur créé avec succès ✅`, "Ok", { duration: 3000 });
              this.dialogRef.close(newData); // Explicitly return the new data
            }),
            catchError((error) => {
              this.snackBar.open(`Error creating interlocutor: ${error} ⛔`, "Ok", { duration: 3000 });
              console.error("Error creating interlocutor: ", error);
              return throwError(error);
            })
        ).subscribe();
      }
    } else {
      this.snackBar.open(`Form is invalid`, "Ok", {duration:3000});
    }
  }

  onReset(): void {
    this.interlocutorForm.reset();
    if (this.interlocutorToUpdate) {
      this.interlocutorForm.patchValue({
        fullName: this.interlocutorToUpdate.fullName,
        active: this.interlocutorToUpdate.active.toLowerCase() === 'active',
        phoneNumber: this.interlocutorToUpdate.phoneNumber?.number,
        emailAddress: this.interlocutorToUpdate.emailAddress?.address,
        prospectId: this.interlocutorToUpdate.customer.id, // Matches the value in prospect options
        jobTitle: this.interlocutorToUpdate.jobTitle ? this.interlocutorToUpdate.jobTitle.id : null,
        departmentId: this.interlocutorToUpdate.department ? this.interlocutorToUpdate.department.id : null
      });
    }
  }

  // Method to handle cancel action
  onCancel(): void {
    this.dialogRef.close();
  }


  isEnabledToCreateInterlocutor() {
    return false;
  }
}
