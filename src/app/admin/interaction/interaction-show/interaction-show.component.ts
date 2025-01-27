import {Component, Inject, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {NgxTimelineComponent} from "@frxjs/ngx-timeline";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BehaviorSubject, tap} from 'rxjs';
import {InteractionResponseDto} from '../../../../dtos/response/interaction.response.dto';
import {InteractionService} from '../../../../services/Leads/interaction.service';
import {EntityEnum} from "../../../../enums/entity.enum";
import {CommentComponent} from "../../../utils/comment/comment.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {InteractionType} from "../../../../enums/interaction.type";
import {InteractionRequestDto} from "../../../../dtos/request/interaction.request.dto";
import {AddProspectDialogComponent} from "../../prospect/add-prospect-dialog/add-prospect-dialog.component";
import {AddEditInteractionDialogComponent} from "../add-edit-interaction-dialog/add-edit-interaction-dialog.component";

@Component({
  selector: 'app-interaction-show',
  standalone: true,
    imports: [
        AsyncPipe,
        DatePipe,
        MatButton,
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatIcon,
        NgForOf,
        NgIf,
        NgxTimelineComponent,
        RouterLink,
        CommentComponent,
        NgClass,
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatError,
        MatIconButton
    ],
  templateUrl: './interaction-show.component.html',
  styleUrl: './interaction-show.component.css'
})
export class InteractionShowComponent implements OnInit{
  interaction: BehaviorSubject<InteractionResponseDto> = new BehaviorSubject<InteractionResponseDto>({} as InteractionResponseDto);
  interactionForm!: FormGroup;

  constructor(private activeRouter: ActivatedRoute, private dialog: MatDialog,
              private interactionService: InteractionService, private fb: FormBuilder) {
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
        return report !== null ? 'status-complete' : 'status-not-complete';
    }

    getStatusLabel(report: string | null): string {
        return report !== null ? 'Complet' : 'Pas complet';
    }

    selectedFile: File | null = null;
    dragHintText = 'Déposez un fichier ici ou cliquez pour sélectionner';

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
                    alert('Rapport ajouté avec succès!');
                },
                error: (err) => {
                    console.error('Erreur lors de l\'ajout du rapport:', err);
                    alert('Erreur lors de l\'ajout du rapport.');
                }
            });
        } else {
            alert('Veuillez entrer un rapport avant de l\'ajouter.');
        }
    }

    sendFile(): void {
        if (this.selectedFile) {
            // Logic to send the file
            console.log('Sending File:', this.selectedFile.name);
            alert('File sent successfully!');
        } else {
            alert('Please select a file before sending.');
        }
    }

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

    removeFile(): void {
        this.selectedFile = null; // Clear the selected file
        this.interactionForm.patchValue({ joinFilePath: null }); // Reset the form control
    }
}
