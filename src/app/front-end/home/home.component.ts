import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {BehaviorSubject, catchError, filter, of, tap} from 'rxjs';
import {CompanyResponseDto} from '../../../dtos/response/CompanyResponseDto';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {LocalStorageService} from '../../../services/local.storage.service';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {CompanyService} from '../../../services/company.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

import {MatList, MatListItem} from '@angular/material/list';
import {MatDivider} from '@angular/material/divider';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  children?: string[] | [];
}

const menuData: { [key: string]: { icon: string; items: MenuItem[] } } = {
  home: {
    icon: 'public',
    items: [{name: 'Accueille', icon: 'house', route: '/admin'}, {
      name: 'Nos Services',
      icon: 'domain',
      route: '/admin/prospects'
    },  {name: 'Nos solutions', icon: 'contacts', route: '/admin/interlocutors'},
      {name: 'Equipe', icon: 'contacts', route: '/admin/interlocutors'}, {
      name: 'Contactz-nous',
      icon: 'forum',
      route: '/admin/interactions'
    },],
  }, crm: {
    icon: 'business_center', // Updated icon for CRM
    items: [{name: 'Dashboard', icon: 'bar_chart', route: '/admin/crm'}, {
      name: 'Contactez-nous',
      icon: 'inventory',
      route: '/crm/products'
    }, {
      name: 'Clients',
      icon: 'contacts',
      route: '/crm/credits'
    }, {
      name: 'Tarifs',
      icon: 'price_change',
      route: '/admin/crm/pricing'
    }, {name: 'Besoins', icon: 'checklist', route: '/admin/crm/need/wms'}, {
      name: 'Offre',
      icon: 'request_quote',
      route: '/crm/quotes'
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
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    MatToolbar,
    MatButton,
    MatIcon,
    MatDrawer,
    NgIf,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    RouterLink,
    AsyncPipe, MatDivider, MatList, MatListItem, MatDrawerContainer, MatCardContent, MatCard, MatCardHeader, MatCardTitle, RouterLinkActive
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  user: any;
  userCompanies: BehaviorSubject<CompanyResponseDto[]> =  new BehaviorSubject<CompanyResponseDto[]>([]);
  selectedCompany: BehaviorSubject<string> =  new BehaviorSubject<string>("");
  currentRoute: string = '';
  activeRouteParams: any = {};
  activeQueryParams: any = {};
  selectedApplication: string = 'home';
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

    this.selectedCompany.next(currentCompany?.name || "test");
  } else {
    const firstCompany = this.userCompanies.getValue()[0];
    this.selectedCompany.next(firstCompany?.name || "");
  }
}

  updateSelectedApplication(): void {
    // Match the active route to an application
  //   if (this.currentRoute.includes('/admin/prospection')) {
  //   this.selectApplication('home');
  // } else if (this.currentRoute.includes('/admin/crm')) {
  //   this.selectApplication('crm');
  // } else if (this.currentRoute.includes('/admin/tms')) {
  //   this.selectApplication('tms');
  // } else if (this.currentRoute.includes('/super-admin')) {
  //   this.selectApplication('admin');
  // } else if (this.currentRoute.includes('/workspace')) {
  //   this.selectApplication('admin');
  // } else {
    this.selectApplication('home'); // Default case
  // }
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
  }

  features = [
    { title: 'CRM & Ventes', description: 'Augmentez vos ventes, gérez vos prospects et automatisez les relations clients.', icon: 'bi bi-graph-up' },
    { title: 'Gestion du Transport (TMS)', description: 'Optimisez votre flotte, réduisez les coûts et suivez les expéditions en temps réel.', icon: 'bi bi-truck' },
    { title: 'Approvisionnement & Achats', description: 'Optimisez les relations avec les fournisseurs et simplifiez le processus d’achat.', icon: 'bi bi-cart-check' },
    { title: 'Gestion du Capital Humain', description: 'Gérez facilement la paie, la présence et les opérations RH.', icon: 'bi bi-people' },
    { title: 'Gestion d’Entrepôt', description: 'Inventaire intelligent, exécution fluide et suivi automatisé des stocks.', icon: 'bi bi-box-seam' },
    { title: 'Analyse de Données', description: 'Des insights puissants grâce à une intelligence d’affaires basée sur l’IA.', icon: 'bi bi-bar-chart' },
  ];


  testimonials = [
    { name: 'John Doe', company: 'LogiTrans', feedback: 'Spider ERP a révolutionné nos opérations logistiques !' },
    { name: 'Sarah Lee', company: 'WarePro', feedback: 'La meilleure solution de gestion d’entrepôt que nous ayons jamais utilisée !' },
    { name: 'Sarah Lee', company: 'WarePro', feedback: 'La meilleure solution de gestion d’entrepôt que nous ayons jamais utilisée !' },
  ];
}
