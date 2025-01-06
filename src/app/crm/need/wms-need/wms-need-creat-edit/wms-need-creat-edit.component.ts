import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  signal, ViewChild
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {InteractionResponseDto} from '../../../../../dtos/response/interaction.response.dto';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatSelect} from '@angular/material/select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelActionRow,
  MatExpansionPanelHeader
} from '@angular/material/expansion';

@Component({
  selector: 'app-wms-need-creat-edit',
  standalone: true,
  imports: [
    MatOption,
    MatLabel,
    MatFormField,
    MatGridTile,
    MatSelect,
    ReactiveFormsModule,
    MatInput,
    MatIcon,
    MatIconButton,
    MatDatepickerToggle,
    MatDatepicker,
    MatGridList, MatDatepickerModule,
    MatDatepicker, MatButton, MatExpansionPanelActionRow, MatExpansionPanelHeader, MatExpansionPanel, MatAccordion,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './wms-need-creat-edit.component.html',
  styleUrl: './wms-need-creat-edit.component.css',
  providers: [provideNativeDateAdapter()],
})
export class WmsNeedCreatEditComponent implements OnInit, AfterViewInit {
  generalInfoFormGroup!: FormGroup;
  itemToStoreFormGroup!: FormGroup;
  unloadForm!: FormGroup;
  managementFeesForm!: FormGroup;
  insuranceForm!: FormGroup;
  readonly panelOpenState = signal(false);
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;

  constructor(private fb: FormBuilder,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeGeneralInfoForm()
    this.initializeItemToStoreForm()
    this.initializeUnloadForm()
    this.initializeManagementFeesForm()
    this.initializeInsuranceForm()
    this.generalInfoFormGroup.get('livre')?.setValue("Ouvert")
  }
  ngAfterViewInit(): void {
    this.generalInfoFormGroup.get('livre')?.setValue("Ouvert")
  }

  initializeGeneralInfoForm(): void{
     this.generalInfoFormGroup = this.fb.group({
       statut: ['', Validators.required],
       dateReception: [ new Date(), Validators.required],
       entreprise: ['', Validators.required],
       interlocuteurs: ['', Validators.required],
       typeProduits: ['', Validators.required],
       dureeStockage: [12, [Validators.required, Validators.min(1)]],
       nombreSku: ['', Validators.required],
       raisonStockage: ['', Validators.required],
       livre: ['', Validators.required],
       tauxCommandes: ['', [Validators.required, Validators.min(0)]],
     });
  }

  initializeItemToStoreForm(): void {
    this.itemToStoreFormGroup = this.fb.group({
      conditionnement: ['', Validators.required],
      structure: [''],
      temperatureStockage: ['', Validators.required],
      largeur: ['', [Validators.min(0)]],
      longueur: ['', [Validators.min(0)]],
      hauteur: ['', [Validators.min(0)]],
      hauteurMax: ['', [Validators.min(0)]],
      poids: ['', [Validators.min(0)]],
      metreCubeMax: ['', [Validators.min(0)]],
      niveauxGerbabilite: [0, [Validators.required, Validators.min(0)]],
      volumeStock: ['', [Validators.min(0)]],
      nombreUvc: ['', [Validators.min(0)]],
    });
  }

  initializeUnloadForm():void {
    this.unloadForm = this.fb.group({
      unload: [[], Validators.required],
    })
  }

  initializeManagementFeesForm():void {
    this.managementFeesForm = this.fb.group({
      fees: [[], ]
    })
  }

  initializeInsuranceForm(): void{
    this.insuranceForm = this.fb.group({
      insurance: [[],],
    })
  }
}
