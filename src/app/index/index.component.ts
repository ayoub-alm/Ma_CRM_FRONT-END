import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterLinkWithHref, RouterOutlet
} from '@angular/router';
import {LocalStorageService} from '../../services/local.storage.service';
import {AsyncPipe, NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {MatIconModule} from '@angular/material/icon';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatTreeModule} from '@angular/material/tree';
import {MatListModule} from '@angular/material/list';
import {BehaviorSubject, catchError, filter, Observable, of, tap} from 'rxjs';
import {MatFormField} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormControl} from '@angular/forms';
import {CompanyService} from '../../services/company.service';
import {CompanyResponseDto} from '../../dtos/response/CompanyResponseDto';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AiChatComponent} from '../utils/ai-chat/ai-chat.component';
import {MatBadge} from '@angular/material/badge';
import {MatTooltip} from '@angular/material/tooltip';
import {LoadingService} from '../../services/loading.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  children?: string[] | [];
}

const menuData: { [key: string]: { icon: string; items: MenuItem[] } } = {
  prospection: {
    icon: 'public',
    items: [{name: 'DASHBOARD', icon: 'bar_chart', route: '/admin/dashboard'},
      {name: 'PROSPECTS', icon: 'domain', route: '/admin/prospects'},
      {name: 'CONTACTS', icon: 'contacts', route: '/admin/interlocutors'},
      {name: 'INTERACTIONS', icon: 'forum', route: '/admin/interactions'},],
  },
  crm: {
    icon: 'business_center', // Updated icon for CRM
    items: [
      {name: 'DASHBOARD', icon: 'bar_chart', route: '/admin/crm/wms/dashboard'},
      {name: 'NEEDS', icon: 'checklist', route: '/admin/crm/wms/needs'},
      {name: 'OFFERS', icon: 'request_quote', route: '/admin/crm/wms/offers'},
      {name: 'CONTRACTS', icon: 'assignment', route: '/admin/crm/wms/contracts'},
      {name: 'DELIVERY_NOTES', icon: 'assignment', route: '/admin/crm/wms/delivery-note'},
      {name: 'INVOICES', icon: 'receipt_long', route: '/admin/crm/wms/invoice'},
      {name: 'ASSETS', icon: 'inventory_2', route: '/admin/crm/wms/credit-notes'},
      {name: 'PAYMENTS', icon: 'euro', route: '/admin/crm/wms/payments'},
      {name: 'PRICING_BASE', icon: 'price_change', route: '/admin/crm/wms/pricing'},
      // {name: 'Grille tarifaire', icon: 'price_change', route: '/admin/crm/wms/pricing'},
    ],
  },
  tms: {
    icon: 'local_shipping',
    items: [
      {name: 'Deliveries', icon: 'local_shipping', route: '/tms/deliveries'},
      {name: 'Orders', icon: 'shopping_cart', route: '/tms/orders'}
    ],
  },
  finances: {
    icon: 'attach_money',
    items: [
      {name: 'Contrats', icon: 'assignment', route: '/admin/crm/wms/contracts'},
      {name: 'Bon de livraison', icon: 'assignment', route: '/admin/crm/wms/delivery-note'},
      {name: 'Factures', icon: 'receipt_long', route: '/admin/crm/wms/invoice'},
      {name: 'ASSETS', icon: 'inventory_2', route: '/admin/crm/wms/credit-notes'},
      {name: 'PAYMENTS', icon: 'euro', route: '/admin/crm/wms/payments'},
    ],
  },
  workspace: {
    icon: 'workspace',
    items: [
      {name: ' Entreprises', icon: 'domain', route: '/super-admin/companies'},
      {name: 'Project', icon: 'work_outline ', route: '/super-admin/projects'},
      {name: 'Utilisateur', icon: 'person', route: '/super-admin/users'},
      {name: 'Mes application', icon: 'apps', route: '/super-admin/users'}
    ],
  },
  admin: {
    icon: 'admin_panel_settings',
    items: [
      {name: ' Entreprises', icon: 'domain', route: '/super-admin/companies'},
      {name: 'Utilisateur', icon: 'person', route: '/super-admin/users'},
      // {name: 'Roles', icon: 'person', route: '/super-admin/users'},
      // {name: 'Permissions', icon: 'person', route: '/super-admin/users'},
      // {name: 'Taxonomies', icon: 'category', route: '/super-admin/users', children: ["Pays", "Villes", "Banques"]},
    ],
  },
};

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [{
  name: 'Taxonomies', children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
}];


@Component({
  standalone: true,
  imports: [MatTreeModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule,
    MatDividerModule, RouterLink, RouterLinkWithHref, NgIf, RouterLinkActive, NgForOf, MatMenu, MatMenuItem, MatMenuTrigger, AsyncPipe, AiChatComponent, MatBadge, MatTooltip, MatProgressBar, UpperCasePipe, TranslatePipe],
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  animations: [
    trigger('rotateIcon', [
      state('closed', style({ transform: 'rotate(0deg)' })),
      state('open', style({ transform: 'rotate(180deg)' })),
      transition('closed <=> open', animate('300ms ease-in-out'))
    ])
  ]
})
export class IndexComponent implements OnInit, AfterViewInit {
  user: any;
  userCompanies: BehaviorSubject<CompanyResponseDto[]> =  new BehaviorSubject<CompanyResponseDto[]>([]);
  selectedCompany: BehaviorSubject<string> =  new BehaviorSubject<string>("");
  currentRoute: string = '';
  activeRouteParams: any = {};
  activeQueryParams: any = {};
  selectedApplication: string = 'prospection';
  menuItems: MenuItem[] = menuData[this.selectedApplication].items;
  @ViewChild('rightDrawer') rightDrawer!: MatDrawer;
  @ViewChild('AiDrawer') AiDrawer!: MatDrawer;
  a = 1
  b = 2
  dataSource = TREE_DATA;
  protected readonly menuData = menuData;
  loading$!: Observable<boolean>;
  availableLanguages = [
     { code: 'it', label: 'Italiano' },
     { code: 'fr', label: 'Français' }
  ];
  currentLanguage = 'fr';
  constructor(private localStorageService: LocalStorageService, private router: Router, private activeRoute: ActivatedRoute,
              private companyService: CompanyService, private loadingService: LoadingService,
              private translateService: TranslateService) {
  }


  /**
   *
   */
  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$;
    this.currentRoute = this.router.url;
    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        // this.updateSelectedApplication();
      });
    // Initial setup
    this.updateSelectedApplication();

    this.companyService.getAllCompanies().pipe(
      tap(companies => {
        this.userCompanies.next(companies)
        this.fillCompany();
      }),
      catchError(err => {
        console.error(err)
        return of(null)
      })
    ).subscribe()
    // init language
    const savedLang = localStorage.getItem('lang') || 'fr';
    this.currentLanguage = savedLang;
    this.translateService.use(savedLang);
  }

  /**
   *
   */
  ngAfterViewInit(): void {
    // Listen for route changes after view initialization
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get the active route URL
        this.currentRoute = this.router.url;

        // Retrieve route params and query params
        this.activeRouteParams = this.activeRoute.snapshot.firstChild?.params || {};
        this.activeQueryParams = this.activeRoute.snapshot.queryParams;

      });
  }


  fillCompany(): void{
    if (this.localStorageService.getItem("selected_company_id")) {
      const selectedCompanyId = parseInt(this.localStorageService.getItem("selected_company_id"));
      const currentCompany = this.userCompanies.getValue().find(
        company => company.id == selectedCompanyId
      );

      this.selectedCompany.next(currentCompany?.name || "No Company Selected");
    } else {
      const firstCompany = this.userCompanies.getValue()[0];
      this.selectedCompany.next(firstCompany?.name || "");
    }
  }

  updateSelectedApplication(): void {
    // Match the active route to an application
    if (this.currentRoute.includes('/admin/prospection')) {
      this.selectApplication('prospection');
    } else if (this.currentRoute.includes('/admin/crm')) {
      this.selectApplication('crm');
    } else if (this.currentRoute.includes('/admin/tms')) {
      this.selectApplication('tms');
    } else if (this.currentRoute.includes('/super-admin')) {
      this.selectApplication('admin');
    } else if (this.currentRoute.includes('/workspace')) {
      this.selectApplication('admin');
    } else {
      this.selectApplication('prospection'); // Default case
    }
  }

  selectApplication(app: string): void {
    this.selectedApplication = app;
    this.menuItems = menuData[app]?.items || [];
    if (this.rightDrawer) {
      this.rightDrawer.close();
    }
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }


  selectCompany(company: CompanyResponseDto) {
    this.localStorageService.setItem("selected_company_id", company.id);
    this.fillCompany();
    window.location.reload();
  }

  /**
   *
   */
  logout() {
    this.localStorageService.setItem('user', null);
    this.router.navigate(['/login']);
    this.localStorageService.setItem('authToken', null);
  }

  /**
   *
   * @param langCode
   */
  changeLanguage(langCode: string): void {
    this.currentLanguage = langCode;
    localStorage.setItem('lang', langCode);
    this.translateService.use(langCode);
  }
}
