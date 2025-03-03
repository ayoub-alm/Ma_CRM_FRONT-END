import {AfterViewInit, ChangeDetectionStrategy, Component, inject, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {
  MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, StepperOrientation
} from '@angular/material/stepper';
import {MatOption, MatSelect} from '@angular/material/select';
import {
  MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle
} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {TitleResponseDto} from '../../../../dtos/init_data/response/title.response.dto';
import {BehaviorSubject, map, Observable, Subscription} from 'rxjs';
import {CompanySizeResponseDto} from '../../../../dtos/init_data/response/company.size.response.dt';
import {JobTitleResponseDto} from '../../../../dtos/init_data/response/job.title.response.dto';
import {ProprietaryStructureDto} from '../../../../dtos/init_data/response/proprietary.structure.dto';
import {CityResponseDto} from '../../../../dtos/init_data/response/city.response.dt';
import {CountryResponseDto} from '../../../../dtos/init_data/response/country.response.dto';
import {IndustryResponseDto} from '../../../../dtos/init_data/response/industry.response.dt';
import {CourtResponseDto} from '../../../../dtos/init_data/response/court.response.dto';
import {LegalStatusDto} from '../../../../dtos/init_data/response/legal.status.dto';
import {LegalStatusService} from '../../../../services/data/legal.status.service.dto';
import {TitleService} from '../../../../services/data/Title.service';
import {CompanySizeService} from '../../../../services/data/company.size.service';
import {JobTitleService} from '../../../../services/data/job.title.service';
import {ProprietaryStructureService} from '../../../../services/data/proprietary.structure.service';
import {CityService} from '../../../../services/data/city.service';
import {CountryService} from '../../../../services/data/country.service';
import {IndustryService} from '../../../../services/data/industry.service';
import {CourtService} from '../../../../services/data/court.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ProspectService} from '../../../../services/Leads/prospect.service';
import {CreateProspectDto} from '../../../../dtos/request/leads/CreateProspectDto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProspectResponseDto} from '../../../../dtos/response/prospect.response.dto';
import {environment} from '../../../../environments/environment';
import {LocalStorageService} from '../../../../services/local.storage.service';

@Component({
  selector: 'app-add-prospect-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatButton, MatFormField, MatStep,
    MatIcon, ReactiveFormsModule, MatStepLabel, MatStepper,
    MatInput, MatLabel, MatDatepickerModule, AsyncPipe, MatSelect, MatOption, NgIf, MatError, NgForOf, MatIconButton],
  templateUrl: './add-prospect-dialog.component.html',
  styleUrl: './add-prospect-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class AddProspectDialogComponent implements OnInit, AfterViewInit {
  protected readonly environment = environment;
  // Define the form groups
  companyDetailsFormGroup!: FormGroup;
  contactInfoFormGroup!: FormGroup;
  legalInfoFormGroup!: FormGroup;
  businessDescriptionFormGroup!: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;
  titles: BehaviorSubject<TitleResponseDto[]> = new BehaviorSubject<TitleResponseDto[]>([]);
  companySizes: BehaviorSubject<CompanySizeResponseDto[]> = new BehaviorSubject<CompanySizeResponseDto[]>([]);
  jobTitles: BehaviorSubject<JobTitleResponseDto[]> = new BehaviorSubject<JobTitleResponseDto[]>([]);
  proprietaryStructures: BehaviorSubject<ProprietaryStructureDto[]> = new BehaviorSubject<ProprietaryStructureDto[]>([]);
  cities: BehaviorSubject<CityResponseDto[]> = new BehaviorSubject<CityResponseDto[]>([]);
  countries: BehaviorSubject<CountryResponseDto[]> = new BehaviorSubject<CountryResponseDto[]>([]);
  industries: BehaviorSubject<IndustryResponseDto[]> = new BehaviorSubject<IndustryResponseDto[]>([]);
  courts: BehaviorSubject<CourtResponseDto[]> = new BehaviorSubject<CourtResponseDto[]>([]);
  legalStatuses: BehaviorSubject<LegalStatusDto[]> = new BehaviorSubject<LegalStatusDto[]>([]);
  subscriptions: Subscription[] = [];
  private _formBuilder = inject(FormBuilder);

  /**
   *
   * Constructor
   */
  constructor(private dialogRef: MatDialogRef<AddProspectDialogComponent>, @Inject(MAT_DIALOG_DATA) public prospect: ProspectResponseDto,
              private titleService: TitleService, private companySizesService: CompanySizeService,
              private jobTitleService: JobTitleService, private proprietaryStructureService: ProprietaryStructureService,
              private cityService: CityService, private countryService: CountryService, private industryService: IndustryService,
              private courtService: CourtService, private legalStatusService: LegalStatusService, private prospectService: ProspectService,
              private snackBar: MatSnackBar, private localStorageService: LocalStorageService) {
    // Define the form groups
    this.companyDetailsFormGroup = this._formBuilder.group({
      companyName: [this.prospect?.name, Validators.required],
      sigle: [this.prospect?.sigle],
      capital: [this.prospect?.capital],
      headOffice: [this.prospect?.headOffice],
      proprietaryStructure: [this.prospect?.proprietaryStructure?.id],
      yearOfCreation: [this.prospect?.yearOfCreation],
      companySize: [this.prospect?.companySize?.id],
      city: [this.prospect?.city?.id],
      country: [this.prospect?.country?.id],
      industry: [this.prospect?.industry?.id]
    });

    this.contactInfoFormGroup = this._formBuilder.group({
      email: [this.prospect?.email, [Validators.required, Validators.email]],
      phone: [this.prospect?.phone, Validators.required],
      fax: [this.prospect?.fax],
      whatsapp: [this.prospect?.whatsapp],
      website: [this.prospect?.website, Validators.pattern('https?://.+')],
      linkedin: [this.prospect?.linkedin, Validators.pattern('https?://.+')]
    });

    this.legalInfoFormGroup = this._formBuilder.group({
      ice: [this.prospect?.ice],
      rc: [this.prospect?.rc],
      ifm: [this.prospect?.ifm],
      patent: [this.prospect?.patent],
      cnss: [this.prospect?.cnss],
      certificationText: [this.prospect?.certificationText],
      legalRepresentative: [this.prospect?.legalRepresentative  ],
      legalRepresentativeTitle: [this.prospect?.reprosentaveJobTitle?.id],
      legalRepresentativeJobTitle: [this.prospect?.reprosentaveJobTitle?.id],
      court: [this.prospect?.court?.name],
      legalStatus: [this.prospect?.legalStatus?.id]
    });

    this.businessDescriptionFormGroup = this._formBuilder.group({
      businessDescription: [this.prospect?.businessDescription],
    });
    const breakpointObserver = inject(BreakpointObserver);
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }


  /**
   * On inti function
   */
  ngOnInit() {
    // Load data for select inputs
    // Subscribe to form control changes for select elements and update the company object
    this.titleService.getAllTitles().subscribe(titles => this.titles.next(titles));
    this.companySizesService.getAllCompaniesSizes().subscribe(sizes => this.companySizes.next(sizes));
    this.jobTitleService.getAllJobTitles().subscribe(jobTitles => this.jobTitles.next(jobTitles));
    this.proprietaryStructureService.getAllProprietaryStructure().subscribe(proprietaryStructures => this.proprietaryStructures.next(proprietaryStructures));
    this.cityService.getAllCities().subscribe(cities => this.cities.next(cities));
    this.countryService.getAllCountries().subscribe(countries => this.countries.next(countries));
    this.industryService.getAllIndustries().subscribe(industries => this.industries.next(industries));
    this.courtService.getAllCourt().subscribe(courts => this.courts.next(courts));
    this.legalStatusService.getAllLegalStatus().subscribe(legalStatuses => this.legalStatuses.next(legalStatuses));
  }

  ngAfterViewInit() {
    if (! this.prospect){
      this.prospect = {} as ProspectResponseDto;
    }

    this.companyDetailsFormGroup.get('companySize')?.valueChanges.subscribe(value =>
      this.prospect.companySize = this.companySizes.getValue().find(size => size.id === value)!);

    this.companyDetailsFormGroup.get('proprietaryStructure')?.valueChanges.subscribe(value =>
    this.prospect.proprietaryStructure = this.proprietaryStructures.getValue().find(ps => ps.id === value)!);

    this.companyDetailsFormGroup.get('city')?.valueChanges.subscribe(value =>
      this.prospect.city = this.cities.getValue().find(city => city.id === value)!);

    this.companyDetailsFormGroup.get('country')?.valueChanges.subscribe(value =>
      this.prospect.country = this.countries.getValue().find(country => country.id === value)!);

    this.companyDetailsFormGroup.get('industry')?.valueChanges.subscribe(value =>
      this.prospect.industry = this.industries.getValue().find(industry => industry.id === value)!);

    this.legalInfoFormGroup.get('legalStatus')?.valueChanges.subscribe(value =>
      this.prospect.legalStatus = this.legalStatuses.getValue().find(status => status.id === value)!);

    this.legalInfoFormGroup.get('court')?.valueChanges.subscribe(value =>
      this.prospect.court = this.courts.getValue().find(court => court.id === value)!);

    this.legalInfoFormGroup.get('legalRepresentativeJobTitle')?.valueChanges.subscribe(value =>
      this.prospect.reprosentaveJobTitle = this.jobTitles.getValue().find(jobTitle => jobTitle.id === value)!);

    this.legalInfoFormGroup.get('legalRepresentativeTitle')?.valueChanges.subscribe(value =>
      this.prospect.title = this.titles.getValue().find(title => title.id === value)!);

  }

  /**
   * This function allows us to create company
   */
  createProspect() {
    // Collect data from form groups
    const companyDetails = this.companyDetailsFormGroup.value;
    const legalInfo = this.legalInfoFormGroup.value;
    const contactInfo = this.contactInfoFormGroup.value;
    const businessDescription = this.businessDescriptionFormGroup.value;

    // Keep the existing logo if the prospect already has an id
    // const logo = this.prospect.id ? this.prospect.logo : companyDetails.logo;

    // Create a new CreateCompanyRequest object
    const prospectId = this.prospect.id ? this.prospect.id : "";
    const newProspect: CreateProspectDto = new CreateProspectDto(prospectId,companyDetails.logo,
      companyDetails.companyName, companyDetails.sigle, companyDetails.capital, companyDetails.headOffice,
      legalInfo.legalRepresentative, companyDetails.yearOfCreation, new Date().toISOString(), // Use a specific date if available
      contactInfo.email, contactInfo.phone, contactInfo.fax, contactInfo.whatsapp, contactInfo.website,
      contactInfo.linkedin, legalInfo.ice, legalInfo.rc, legalInfo.ifm, legalInfo.patent, legalInfo.cnss,
      legalInfo.certificationText, businessDescription.businessDescription,
      this.prospect.legalStatus, this.prospect.city, this.prospect.court, this.prospect.companySize, this.prospect.industry,
      this.prospect.country, this.prospect.proprietaryStructure, this.prospect.title, this.prospect.reprosentaveJobTitle, this.localStorageService.getCurrentCompanyId());
    // Call the service to create the company
    this.prospectService.createCustomer(newProspect).subscribe({
      next: (response: CreateProspectDto) => {
        this.showSnackBar(`${response.name} a été créé avec succès`);
        this.dialogRef.close(response);
      },
      error: (error) => {
        if (error.status === 201) {
          this.showSnackBar(`${this.prospect.name} a été mis à jour avec succès`);
          this.dialogRef.close(newProspect);
        } else {
          this.showSnackBar(`Error creating company: ${error.status}`, true);
        }
      },
    });
  }


  /**
   * Helper function to show snack bar notifications.
   * @param message The message to display in the snack bar.
   * @param isError Optional: true if the notification is for an error.
   */
  private showSnackBar(message: string, isError: boolean = false): void {
    this.snackBar.open(message, "OK", {
      verticalPosition: "bottom",
      duration: 3000,
      panelClass: isError ? ['snack-bar-error'] : ['snack-bar-success'],
    });
  }
  /**
   *
   * @param event
   */
  // onLogoUpload(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length) {
  //     const file = input.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       // Set the base64-encoded image in the company object
  //       this.prospect.logo = reader.result as string; // You store the base64 string here
  //       this.companyDetailsFormGroup.patchValue({logo: this.prospect.logo});
  //       const logoElement = document.getElementById('logo1') as HTMLImageElement;
  //       if (logoElement) {
  //         logoElement.setAttribute('src', reader.result as string);
  //       }
  //       this.prospect.logo = reader.result as string;
  //     };
  //     reader.readAsDataURL(file); // Read file as base64
  //   }
  // }

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

  // onLogoUpload(event: Event): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     // Handle logo upload logic here
  //     console.log('Logo uploaded:', file);
  //     this.prospectForm.get('logo')?.setValue(file);
  //   }
  // }


  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Change the style to indicate that the file can be dropped
    // event.target?.classList.add('drag-over');
  }

  /**
   * Handle drag leave event to revert style
   * @param event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Revert the style
    // event.target?.classList.remove('drag-over');
  }

}
