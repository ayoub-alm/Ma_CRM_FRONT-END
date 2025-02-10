import {AfterViewInit, Component, Inject, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatStep, MatStepLabel, MatStepper, StepperOrientation} from "@angular/material/stepper";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CompanyModel} from "../../../models/super-admin/company.model";
import {TitleService} from "../../../../services/data/Title.service";
import {CompanySizeService} from "../../../../services/data/company.size.service";
import {JobTitleService} from "../../../../services/data/job.title.service";
import {ProprietaryStructureService} from "../../../../services/data/proprietary.structure.service";
import {CityService} from "../../../../services/data/city.service";
import {CountryService} from "../../../../services/data/country.service";
import {IndustryService} from "../../../../services/data/industry.service";
import {CourtService} from "../../../../services/data/court.service";
import {LegalStatusService} from "../../../../services/data/legal.status.service.dto";
import {ProspectService} from "../../../../services/Leads/prospect.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BehaviorSubject, catchError, map, Observable, of, tap, throwError} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {TitleModel} from "../../../models/init_data_models/title.model";
import {CompanySizeModel} from "../../../models/init_data_models/companySize.model";
import {JobTitleModel} from "../../../models/init_data_models/jobTitle.model";
import {ProprietaryStructureModel} from "../../../models/init_data_models/proprietaryStructure.model";
import {CityModel} from "../../../models/init_data_models/city.model";
import {CountryModel} from "../../../models/init_data_models/country.model";
import {IndustryModel} from "../../../models/init_data_models/industry.model";
import {CourtModel} from "../../../models/init_data_models/court.model";
import {LegalStatusModel} from "../../../models/init_data_models/legalStatus.model";
import {CompanyService} from "../../../../services/company.service";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-update-company',
  standalone: true,
    imports: [
        AsyncPipe,
        MatButton,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatError,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        MatStep,
        MatStepLabel,
        MatStepper,
        NgForOf,
        NgIf,
        PaginatorModule,
        ReactiveFormsModule
    ],
  templateUrl: './add-update-company.component.html',
  styleUrl: './add-update-company.component.css'
})
export class AddUpdateCompanyComponent implements OnInit, AfterViewInit {
    protected readonly environment = environment;
    // Define the form groupes
    companyDetailsFormGroup!: FormGroup;
    contactInfoFormGroup!: FormGroup;
    legalInfoFormGroup!: FormGroup;
    businessDescriptionFormGroup!: FormGroup;
    stepperOrientation: Observable<StepperOrientation>;
    titles: BehaviorSubject<TitleModel[]> = new BehaviorSubject<TitleModel[]>([]);
    companySizes: BehaviorSubject<CompanySizeModel[]> = new BehaviorSubject<CompanySizeModel[]>([]);
    jobTitles: BehaviorSubject<JobTitleModel[]> = new BehaviorSubject<JobTitleModel[]>([]);
    proprietaryStructures: BehaviorSubject<ProprietaryStructureModel[]> = new BehaviorSubject<ProprietaryStructureModel[]>([]);
    cities: BehaviorSubject<CityModel[]> = new BehaviorSubject<CityModel[]>([]);
    countries: BehaviorSubject<CountryModel[]> = new BehaviorSubject<CountryModel[]>([]);
    industries: BehaviorSubject<IndustryModel[]> = new BehaviorSubject<IndustryModel[]>([]);
    courts: BehaviorSubject<CourtModel[]> = new BehaviorSubject<CourtModel[]>([]);
    legalStatuses: BehaviorSubject<LegalStatusModel[]> = new BehaviorSubject<LegalStatusModel[]>([]);
    private _formBuilder = inject(FormBuilder);

    constructor(private dialogRef: MatDialogRef<AddUpdateCompanyComponent>, @Inject(MAT_DIALOG_DATA) public company: CompanyModel,
                private titleService: TitleService, private companySizesService: CompanySizeService,
                private jobTitleService: JobTitleService, private proprietaryStructureService: ProprietaryStructureService,
                private cityService: CityService, private countryService: CountryService, private industryService: IndustryService,
                private courtService: CourtService, private legalStatusService: LegalStatusService, private companyService: CompanyService,
                private snackBar: MatSnackBar) {
        // Define the form groups
        this.companyDetailsFormGroup = this._formBuilder.group({
            companyName: [this.company?.name, Validators.required],
            sigle: [this.company?.sigle],
            logo: [this.company?.logo],
            capital: [this.company?.capital],
            headOffice: [this.company?.headOffice],
            proprietaryStructure: [this.company?.proprietaryStructure?.id, Validators.required],
            yearOfCreation: [this.company?.yearOfCreation],
            companySize: [this.company?.companySize?.id, Validators.required],
            city: [this.company?.city?.id, Validators.required],
            country: [this.company?.country?.id, Validators.required],
            industry: [this.company?.industry?.id, Validators.required]
        });

        this.contactInfoFormGroup = this._formBuilder.group({
            email: [this.company?.email, [Validators.required, Validators.email]],
            phone: [this.company?.phone, Validators.required],
            fax: [this.company?.fax],
            whatsapp: [this.company?.whatsapp],
            website: [this.company?.website, Validators.pattern('https?://.+')],
            linkedin: [this.company?.linkedin, Validators.pattern('https?://.+')]
        });

        this.legalInfoFormGroup = this._formBuilder.group({
            ice: [this.company?.ice],
            rc: [this.company?.rc],
            ifm: [this.company?.ifm],
            patent: [this.company?.patent],
            cnss: [this.company?.cnss],
            certificationText: [this.company?.certificationText],
            legalRepresentative: [this.company?.legalRepresentative],
            legalRepresentativeTitle: [this.company?.reprosentaveJobTitle?.id],
            legalRepresentativeJobTitle: [this.company?.reprosentaveJobTitle?.id],
            court: [this.company?.court?.name],
            legalStatus: [this.company?.legalStatus?.id, Validators.required]
        });

        this.businessDescriptionFormGroup = this._formBuilder.group({
            businessDescription: [this.company?.businessDescription],
        });
        const breakpointObserver = inject(BreakpointObserver);
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    }

    ngOnInit() {
        // Subscribe to form control changes for select elements and update the company object
        this.titleService.getAllTitles().subscribe(titles => this.titles.next(titles));
        this.companySizesService.getAllCompaniesSizes().subscribe(sizes => this.companySizes.next(sizes));
        this.jobTitleService.getAllJobTitles().subscribe(jobTitles => this.jobTitles.next(jobTitles));
        this.proprietaryStructureService.getAllProprietaryStructure().subscribe(proprietaryStructures =>
            this.proprietaryStructures.next(proprietaryStructures));
        this.cityService.getAllCities().subscribe(cities => this.cities.next(cities));
        this.countryService.getAllCountries().subscribe(countries => this.countries.next(countries));
        this.industryService.getAllIndustries().subscribe(industries => this.industries.next(industries));
        this.courtService.getAllCourt().subscribe(courts => this.courts.next(courts));
        this.legalStatusService.getAllLegalStatus().subscribe(legalStatuses => this.legalStatuses.next(legalStatuses));
    }

    ngAfterViewInit() {
        // Ensure the `Company` object is initialized to prevent null/undefined errors
        if (!this.company){
            this.company = {} as CompanyModel;
        }
        // Subscribe to form changes and update `comapny` properties accordingly
        this.companyDetailsFormGroup.get('compantSize')?.valueChanges.subscribe(value =>
         this.company.companySize = this.companySizes.getValue().find(size => size.id === value)!);

        this.companyDetailsFormGroup.get('proprietaryStructure')?.valueChanges.subscribe(value =>
            this.company.proprietaryStructure = this.proprietaryStructures.getValue().find(ps => ps.id === value)!);

        this.companyDetailsFormGroup.get('city')?.valueChanges.subscribe(value =>
            this.company.city = this.cities.getValue().find(city => city.id === value)!);

        this.companyDetailsFormGroup.get('country')?.valueChanges.subscribe(value =>
            this.company.country = this.countries.getValue().find(country => country.id === value)!);

        this.companyDetailsFormGroup.get('industry')?.valueChanges.subscribe(value =>
            this.company.industry = this.industries.getValue().find(industry => industry.id === value)!);

        this.legalInfoFormGroup.get('legalStatus')?.valueChanges.subscribe(value =>
            this.company.legalStatus = this.legalStatuses.getValue().find(status => status.id === value)!);

        this.legalInfoFormGroup.get('court')?.valueChanges.subscribe(value =>
            this.company.court = this.courts.getValue().find(court => court.id === value)!);

        this.legalInfoFormGroup.get('legalRepresentativeJobTitle')?.valueChanges.subscribe(value =>
            this.company.reprosentaveJobTitle = this.jobTitles.getValue().find(jobTitle => jobTitle.id === value)!);

        this.legalInfoFormGroup.get('legalRepresentativeTitle')?.valueChanges.subscribe(value =>
            this.company.title = this.titles.getValue().find(title => title.id === value)!);
    }

    createOrUpdateCompany() {
        if (!this.companyDetailsFormGroup.valid || !this.legalInfoFormGroup.valid || !this.contactInfoFormGroup.valid ||
            !this.businessDescriptionFormGroup.valid) {
            this.snackBar.open("Veuillez remplir tous les champs obligatoires ⚠️", "Ok", { duration: 3000 });
            return;
        }

        // Collect data form groups
        const companyDetails = this.companyDetailsFormGroup.value;
        const legalInfo = this.legalInfoFormGroup.value;
        const contactInfo = this.contactInfoFormGroup.value;
        const businessDescription = this.businessDescriptionFormGroup.value;

        const newCompany: CompanyModel = new CompanyModel({
            id: this.company.id?this.company.id:null,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
            createdBy: "",
            logo: null,
            name: companyDetails.companyName,
            sigle: companyDetails.sigle,
            capital: companyDetails.capital,
            headOffice: companyDetails.headOffice,
            legalRepresentative: legalInfo.legalRepresentative,
            yearOfCreation: companyDetails.yearOfCreation,
            dateOfRegistration: new Date().toISOString(), // Utilisation d'une date spécifique si nécessaire
            email: contactInfo.email,
            phone: contactInfo.phone,
            fax: contactInfo.fax,
            whatsapp: contactInfo.whatsapp,
            website: contactInfo.website,
            linkedin: contactInfo.linkedin,
            ice: legalInfo.ice,
            rc: legalInfo.rc,
            ifm: legalInfo.ifm,
            patent: legalInfo.patent,
            cnss: legalInfo.cnss,
            businessDescription: businessDescription.businessDescription,
            legalStatus: this.company.legalStatus,
            city: this.company.city,
            court: this.company.court,
            companySize: this.company.companySize,
            industry: this.company.industry,
            country: this.company.country,
            proprietaryStructure: this.company.proprietaryStructure,
            title: this.company.title,
            reprosentaveJobTitle: this.company.reprosentaveJobTitle,
            certificationText: legalInfo.certificationText,
        });

        // Determine whether to update or create
        if(this.company?.id){
            // Call the service to update the company
            this.companyService.updateCompany(this.company.id ,newCompany).pipe(
                tap((updatedData) => {
                    this.snackBar.open(`Entroprise mis à jour : ${updatedData.name} ✅`, "Ok", { duration: 3000 });
                    this.dialogRef.close(updatedData); // Explicitly return the updated data
                }),
                catchError((error) => {
                    this.snackBar.open(`Error ${error.message} ⛔`, "Ok", { duration: 3000 });
                    console.error('Error Modifier:', error); // Debugging statement
                    return of(null)
                })
            ).subscribe();
        }   else {
            // Call the service to create the company
            this.companyService.createCompany(newCompany).pipe(
                tap((newData) => {
                    this.snackBar.open(`Entroprise créé avec succès ✅`, "Ok", { duration: 3000 });
                    this.dialogRef.close(newData); // Explicitly return the new data
                }),catchError((error) => {
                    this.snackBar.open(`Error creating Entroprise: ${error} ⛔`, "Ok", { duration: 3000 });
                    console.error("Error creating Company: ", error);
                    return throwError(error);
                })
            ).subscribe();
        }
    }

    /**
     *
     * @param event
     */
    onLogoUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                // Set the base64-encoded image in the company object
                this.company.logo = reader.result as string; // You store the base64 string here
                this.companyDetailsFormGroup.patchValue({logo: this.company.logo});
                const logoElement = document.getElementById('logo1') as HTMLImageElement;
                if (logoElement) {
                    logoElement.setAttribute('src', reader.result as string);
                }
                this.company.logo = reader.result as string;
            };
            reader.readAsDataURL(file); // Read file as base64
        }
    }

    /**
     *
     */
    isEnabledToCreateCompany(): boolean {
        return this.companyDetailsFormGroup.valid && this.contactInfoFormGroup.valid && this.legalInfoFormGroup.valid &&
            this.businessDescriptionFormGroup.valid;
    }

    get website() {
        return this.contactInfoFormGroup.get('website');
    }

    get linkedin() {
        return this.contactInfoFormGroup.get('linkedin');
    }


    onLogoDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer?.files.length) {
            // this.onLogoUpload({ target: { files: event.dataTransfer.files } });
        }
    }


    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Handle drag leave event to revert style
     * @param event
     */
    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    clearLogo(): void {
        this.companyDetailsFormGroup.get('logo')?.setValue(null);
    }

}
