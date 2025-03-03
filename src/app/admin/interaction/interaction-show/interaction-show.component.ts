import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
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
    ],
  templateUrl: './interaction-show.component.html',
  styleUrl: './interaction-show.component.css'
})
export class InteractionShowComponent implements OnInit{
  interaction: BehaviorSubject<InteractionResponseDto> = new BehaviorSubject<InteractionResponseDto>({} as InteractionResponseDto);
  interactionForm!: FormGroup;

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
}
