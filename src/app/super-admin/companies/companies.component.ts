import { Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {BehaviorSubject, catchError, EMPTY, tap} from "rxjs";
import {CompanyResponseDto} from "../../../dtos/response/CompanyResponseDto";
import {CompanyService} from "../../../services/company.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {environment} from '../../../environments/environment';
import {CompanyModel} from "../../models/super-admin/company.model";
import {AddUpdateCompanyComponent} from "../../workspace/companies/add-update-company/add-update-company.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-companies',
  standalone: true,
    imports: [
        MatButton,
        MatCard,
        MatCardContent,
        MatIcon,
        MatMenu,
        MatMenuItem,
        NgIf,
        MatDivider,
        MatSlideToggle,
        MatTab,
        MatTabGroup,
        MatTabLabel,
        MatMenuTrigger,
        MatCardTitle
    ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit{
    company: BehaviorSubject<CompanyModel> = new BehaviorSubject<CompanyModel>({} as CompanyModel);
    companyOld: BehaviorSubject<CompanyResponseDto> = new BehaviorSubject<CompanyResponseDto>({} as CompanyResponseDto);
    protected readonly environment = environment;

    constructor(private companyService: CompanyService, private activatedRoute: ActivatedRoute,private dialog: MatDialog,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        console.log("Route Params:", this.activatedRoute.snapshot.paramMap.get('id')); // Vérifie si l'ID est bien reçu

        const companyId = Number(localStorage.getItem('selected_company_id'));
        if (!companyId) {
            console.error("Invalid company ID!");
            return;
        }

        this.companyService.getCompanyById(companyId).subscribe(company => {
            this.company.next(company) ;
            console.log("Company loaded:", this.company);
        });
    }
    openAddCompanyDialog(): void {
        const dialogRef = this.dialog.open(AddUpdateCompanyComponent, {
            maxWidth: '900px',
            maxHeight:'100vh'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Handle the result, update the prospect if necessary
                this.company.next(result)
            }
        });

    }
    /**
     * This function allows to edit prospect
     * @param row
     */
    editCompany(row: any): void {
        // Open dialog for editing the prospect
        const dialogRef = this.dialog.open(AddUpdateCompanyComponent, {
            maxWidth: '900px', data: this.company.getValue() // Pass the prospect data to the dialog for editing
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Handle the result, update the prospect if necessary
                this.company.next(result)
            }
        });
    }

    // Component
    showModifierHint = false;
    uploadingLogo = false;
    logoPreview: string | ArrayBuffer | null = null;

    getDefaultLogo(): string {
        const company = this.company.getValue();
        return company?.id ? `${this.environment.baseUrl}/api/images/${company.logo}` : 'https://placehold.co/400';
    }


    handleLogoUpload(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.snackBar.open('Seuls les fichiers image sont autorisés', 'Fermer', { duration: 3000 });
            return;
        }
        // Show preview
        const reader = new FileReader();
        reader.onload = () => this.logoPreview = reader.result;
        reader.readAsDataURL(file);
        // Trigger the upload & update
        this.uploadLogo(file);
    }

    private uploadLogo(file: File) {
        this.uploadingLogo = true;
        const formData = new FormData();
        formData.append('logo', file);

        this.companyService.updateCompanyLogo(this.companyOld.getValue().id, formData).pipe(
            tap((updatedCompany) => {
                // Update the local prospect state with the new logo
                this.companyOld.next(updatedCompany);
                // Notify the user
                this.snackBar.open('Logo mis à jour automatiquement ✅', 'Fermer', { duration: 3000 });
                // Reset upload state
                this.uploadingLogo = false;
                this.showModifierHint = false;
            }),
            catchError((err) => {
                console.error('Échec de la mise à jour du logo', err);
                this.snackBar.open('Échec de la mise à jour du logo ⛔', 'Fermer', { duration: 3000 });
                this.uploadingLogo = false;
                return EMPTY;
            })
        ).subscribe();
    }
}
