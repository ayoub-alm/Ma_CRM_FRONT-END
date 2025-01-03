import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  MatOption,
  NativeDateAdapter, provideNativeDateAdapter
} from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InteractionRequestDto } from '../../../../dtos/request/interaction.request.dto';
import { InteractionResponseDto } from '../../../../dtos/response/interaction.response.dto';
import { InteractionService } from '../../../../services/Leads/interaction.service';
import { InteractionType } from '../../../../enums/interaction.type';
import { InteractionSubject } from '../../../../enums/interaction.subject';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {ProspectService} from '../../../../services/Leads/prospect.service';
import {BehaviorSubject, Subject, takeUntil, tap} from 'rxjs';
import {ProspectResponseDto} from '../../../../dtos/response/prospect.response.dto';
import {InterlocutorService} from '../../../../services/Leads/interlocutor.service';
import {InterlocutorResDto} from '../../../../dtos/response/interlocutor.dto';
import {UserDto} from '../../../../dtos/response/usersResponseDto';
import {UsersService} from '../../../../services/users.service';
export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-edit-interaction-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatInput,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatDatepickerModule,
    MatNativeDateModule,
    NgForOf,
    NgIf,
    MatIcon,
    MatDialogClose,
    MatIconButton,
    AsyncPipe
  ],
  templateUrl: './add-edit-interaction-dialog.component.html',
  styleUrls: ['./add-edit-interaction-dialog.component.css'],
  providers: [provideNativeDateAdapter()],
})
export class AddEditInteractionDialogComponent implements OnInit {
  interactionForm!: FormGroup;
  interactionSubjects = Object.values(InteractionSubject);
  interactionTypes = Object.values(InteractionType);
  isEditMode = false;
  prospects: BehaviorSubject<ProspectResponseDto[]> =  new BehaviorSubject<ProspectResponseDto[]>([]);
  interlocutors: BehaviorSubject<InterlocutorResDto[]> =  new BehaviorSubject<InterlocutorResDto[]>([]);
  allInterlocutors: BehaviorSubject<InterlocutorResDto[]> =  new BehaviorSubject<InterlocutorResDto[]>([]);
  users: BehaviorSubject<UserDto[]> =  new BehaviorSubject<UserDto[]>([]);
  dragHintText = 'Drag and drop a file here or click to select';
  selectedFile: File | null = null;
  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditInteractionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InteractionResponseDto | null,
    private interactionService: InteractionService,
    private snackBar: MatSnackBar,
    private prospectService: ProspectService,
    private interlocutorService: InterlocutorService,
    private usersService: UsersService
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.interactionForm = this.fb.group({
      prospectId: [this.data?.prospectId || '', Validators.required],
      interlocutorId: [this.data?.interlocutorId || '', Validators.required],
      report: [this.data?.report || '', Validators.required],
      interactionSubject: [this.data?.interactionSubject || '', Validators.required],
      interactionType: [this.data?.interactionType || '', Validators.required],
      planningDate: [this.data?.planningDate || null], // Optional field
      joinFilePath: [this.data?.joinFilePath || ''], // Optional field
      address: [this.data?.address || ''], // Optional field
      agentId: [this.data?.agentId || ''],
      affectedToId: [this.data?.affectedToId || ''], // Optional field
    });
    // fetch prospect
    this.prospectService.getAllProspects().pipe(
      tap(data => {
        this.prospects.next(data);
        if (this.data){
          this.interactionForm.get('prospectId')?.setValue(this.data?.prospectId)
        }
      }),
    takeUntil(this.destroy$)
    ).subscribe()
    // fetch interlocutors
    this.interlocutorService.getAllInterlocutors().pipe(
      tap(data => {
        this.interlocutors.next(data)
        this.allInterlocutors.next(data)
        if (this.data){
          this.interactionForm.get('interlocutorId')?.setValue(this.data?.interlocutorId)
        }
      })
    ).subscribe()
    // fetch all users
    this.usersService.getAllUsers().pipe(
      tap(data => {
        this.users.next(data)
      })
    ).subscribe()
    // subscribe to company changes and select interlocutors based on selected company
    this.interactionForm.get('prospectId')?.valueChanges.pipe(tap(value => {
      const selectedInterlocutors: InterlocutorResDto[] = this.allInterlocutors.getValue().filter((interlocutor => interlocutor.prospect.id === value ))
      this.interlocutors.next(selectedInterlocutors)
    })).subscribe()
  }

  saveInteraction(): void {
    if (this.interactionForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const request: InteractionRequestDto = this.interactionForm.value;

    if (this.isEditMode && this.data?.id) {
      this.interactionService.createOrUpdateInteraction(request).subscribe({
        next: (updatedInteraction) => {
          this.snackBar.open('Interaction updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(updatedInteraction);
        },
        error: (err) => {
          console.error('Error updating interaction:', err);
          this.snackBar.open('Failed to update interaction.', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.interactionService.createOrUpdateInteraction(request).subscribe({
        next: (newInteraction) => {
          this.snackBar.open('Interaction created successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(newInteraction);
        },
        error: (err) => {
          console.error('Error creating interaction:', err);
          this.snackBar.open('Failed to create interaction.', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    target.classList.remove('drag-over');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.interactionForm.patchValue({ joinFilePath: this.selectedFile.name });
    }

    const target = event.target as HTMLElement;
    target.classList.remove('drag-over');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.interactionForm.patchValue({ joinFilePath: this.selectedFile.name });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onReset() {
    this.interactionForm.reset()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
