import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BehaviorSubject, tap} from 'rxjs';
import {InteractionResponseDto} from '../../../../dtos/response/interaction.response.dto';
import {InteractionService} from '../../../../services/Leads/interaction.service';
import {EntityEnum} from "../../../../enums/entity.enum";
import {CommentComponent} from "../../../utils/comment/comment.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDialog} from "@angular/material/dialog";
import {AddEditInteractionDialogComponent} from "../add-edit-interaction-dialog/add-edit-interaction-dialog.component";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {TrackingLogComponent} from '../../../utils/tracking-log/tracking-log.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {UploadFileComponent} from '../../../utils/upload-file/upload-file.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-interaction-show',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatIcon,
    NgIf,
    RouterLink,
    CommentComponent,
    NgClass,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatDrawer,
    MatIconButton,
    MatToolbar, MatDrawerContainer, MatDrawer, TranslatePipe,
  ],
  templateUrl: './interaction-show.component.html',
  styleUrl: './interaction-show.component.css'
})
export class InteractionShowComponent implements OnInit{
  interaction: BehaviorSubject<InteractionResponseDto> = new BehaviorSubject<InteractionResponseDto>({} as InteractionResponseDto);
  interactionForm!: FormGroup;
  selectedFile: File | null = null;
  isDragging = false;
  uploadedUrl: string | undefined = undefined;

  constructor(private activeRouter: ActivatedRoute, private dialog: MatDialog,
              private interactionService: InteractionService, private fb: FormBuilder,private snackBar: MatSnackBar) {
      this.interactionForm = this.fb.group({
          report: [''],
          joinFilePath: ['']
      });
  }

  ngOnInit(): void {
    const interactionId:string | null = this.activeRouter.snapshot.paramMap.get('id');
    if (interactionId){
      this.interactionService.getInteractionById(parseInt(interactionId)).pipe(tap(data => {
        this.interaction.next(data);
        this.uploadedUrl = data.joinFilePath;

        this.interactionForm.patchValue({
            report: data.report,
            joinFilePath: data.joinFilePath
        });
      })).subscribe()
    }
  }

  protected readonly EntityEnum = EntityEnum;

  getChipClass(report: string | null): string {
      return report !== null && report !== '' ? 'status-complete' : 'status-not-complete';
  }

  getStatusLabel(report: string | null): string {
      return report !== null && report !== '' ? 'Complet' : 'Pas complet';
  }

  sendReport(): void {
      const reportContent = this.interactionForm.get('report')?.value;
      if (reportContent) {
          const currentInteraction = this.interaction.getValue();

          // Créer une copie de l'interaction actuelle avec le nouveau rapport
          const updatedInteraction = {
              ...currentInteraction, // Conserver tous les champs existants
              report: reportContent  // Mettre à jour uniquement le champ `report`
          };
          this.interactionService.createOrUpdateInteraction(updatedInteraction).subscribe({
              next: (updatedInteractionResponse) => {
                  // Mettre à jour l'état local avec la nouvelle interaction
                  this.interaction.next(updatedInteractionResponse);
                  this.interactionForm.patchValue({
                      report: updatedInteractionResponse.report
                  });
                  this.snackBar.open('Rapport ajouté avec succès!', "OK", {duration: 3000, panelClass: ['success-snackbar']});
              },
              error: (err) => {
                  console.error('Erreur lors de l\'ajout du rapport:', err);
                 this.snackBar.open('Erreur lors de l\'ajout du rapport.', "OK", {duration: 3000, panelClass: ['success-snackbar']});
              }
          });
      } else {
        this.snackBar.open('Veuillez entrer un rapport avant de l\'ajouter.', "OK", {duration: 3000, panelClass: ['success-snackbar']});
      }
  }

  /**
   *
   * @param row
   */
  editProspect(row: any): void {
      // Open dialog for editing the prospect
      const dialogRef = this.dialog.open(AddEditInteractionDialogComponent, {
          maxWidth: '900px', data: this.interaction.getValue() // Pass the prospect data to the dialog for editing
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              // Handle the result, update the prospect if necessary
              this.interaction.next(result)
          }
      });
  }
  private _bottomSheet = inject(MatBottomSheet);
  openBottomSheet() {
      const entityType = 'com.sales_scout.entity.leads.Interaction';
      const entityId = this.interaction.getValue().id;
      this._bottomSheet.open(TrackingLogComponent, {
          data: { entityType, entityId }
      });
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.uploadFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    if (!this.interaction.getValue().id) return;
    this.selectedFile = file;
    this.interactionService.uploadReportFile(this.interaction.getValue().id, file).subscribe({
      next: (url) => {
        this.uploadedUrl = url;
        this.interaction.getValue().joinFilePath = url;
        this.snackBar.open('Rapport PDF téléversé avec succès ✅', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors du téléversement du Rapport PDF ❌', 'Fermer', { duration: 3000 });
      },
    });
  }
}
