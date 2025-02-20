import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterLinkWithHref, RouterOutlet
} from '@angular/router';
import {LocalStorageService} from '../../services/local.storage.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {MatIconModule} from '@angular/material/icon';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatTreeModule} from '@angular/material/tree';
import {MatListModule} from '@angular/material/list';
import {BehaviorSubject, catchError, filter, of, tap} from 'rxjs';
import {MatFormField} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormControl} from '@angular/forms';
import {CompanyService} from '../../services/company.service';
import {CompanyResponseDto} from '../../dtos/response/CompanyResponseDto';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  children?: string[] | [];
}

const menuData: { [key: string]: { icon: string; items: MenuItem[] } } = {
  prospection: {
    icon: 'public',
    items: [{name: 'Dashboard', icon: 'bar_chart', route: '/admin'}, {
      name: 'Prospects',
      icon: 'domain',
      route: '/admin/prospects'
    }, {name: 'Interlocutors', icon: 'contacts', route: '/admin/interlocutors'}, {
      name: 'Interactions',
      icon: 'forum',
      route: '/admin/interactions'
    },],
  }, crm: {
    icon: 'business_center', // Updated icon for CRM
    items: [{name: 'Dashboard', icon: 'bar_chart', route: '/admin/crm'}, {
      name: 'Clients',
      icon: 'contacts',
      route: '/admin/crm/wms/customers'
    }, {
      name: 'Tarifs',
      icon: 'price_change',
      route: '/admin/crm/wms/pricing'
    }, {name: 'Besoins', icon: 'checklist', route: '/admin/crm/wms/needs'}, {
      name: 'Offre',
      icon: 'request_quote',
      route: '/admin/crm/wms/offers'
    },{name: 'Contrats', icon: 'assignment', route: '/crm/contracts'}
    , {name: 'Factures', icon: 'receipt_long', route: '/admin/crm/invoices'}, {
      name: 'Recouvrement',
      icon: 'account_balance_wallet',
      route: '/crm/collections'
    },
      {name: 'Avoirs', icon: 'credit_score', route: '/crm/credits'},
    ],
  }, tms: {
    icon: 'local_shipping',
    items: [{name: 'Deliveries', icon: 'local_shipping', route: '/tms/deliveries'}, {
      name: 'Orders',
      icon: 'shopping_cart',
      route: '/tms/orders'
    },],
  }, workspace: {
    icon: 'workspace',
    items: [{name: ' Entreprises', icon: 'domain', route: '/super-admin/companies'}, {
      name: 'Project',
      icon: 'work_outline ',
      route: '/super-admin/projects'
    }, {name: 'Utilisateur', icon: 'person', route: '/super-admin/users'}, {
      name: 'Mes application',
      icon: 'apps',
      route: '/super-admin/users'
    },],
  }, admin: {
    icon: 'admin_panel_settings',
    items: [{name: ' Entreprises', icon: 'domain', route: '/super-admin/companies'}, {
      name: 'filiale',
      icon: 'apartment',
      route: '/super-admin/users'
    }, {name: 'Project', icon: 'work_outline ', route: '/super-admin/projects'}, {
      name: 'Utilisateur',
      icon: 'person',
      route: '/super-admin/users'
    }, {name: 'Taxonomies', icon: 'category', route: '/super-admin/users', children: ["Pays", "Villes", "Banques"]},],
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
  imports: [MatTreeModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MatDividerModule, RouterLink, RouterLinkWithHref, CdkTrapFocus, NgIf, MatCard, RouterLinkActive, NgForOf, MatFormField, MatSelect, MatOption, MatMenu, MatMenuItem, MatMenuTrigger, MatButtonToggle, MatButtonToggleGroup, AsyncPipe],
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
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
  a = 1
  b = 2
  dataSource = TREE_DATA;
  protected readonly menuData = menuData;

  constructor(private localStorageService: LocalStorageService, private router: Router, private activeRoute: ActivatedRoute,
              private companyService: CompanyService) {
  }

  childrenAccessor = (node: FoodNode) => node.children ?? [];

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  /**
   *
   */
  ngOnInit(): void {
    this.currentRoute = this.router.url;
    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        this.updateSelectedApplication();
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
}
