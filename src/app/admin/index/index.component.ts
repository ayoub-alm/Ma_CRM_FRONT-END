import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterLinkWithHref,
  RouterOutlet
} from '@angular/router';
import { LocalStorageService } from '../../../services/local.storage.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {MatIconModule} from '@angular/material/icon';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatTreeModule} from '@angular/material/tree';
import {MatListModule} from '@angular/material/list';
import {filter} from 'rxjs';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  color?: string | "black";
}

const menuData: { [key: string]: { icon: string; items: MenuItem[] } } = {
  prospection: {
    icon: 'public',
    items: [
      { name: 'Dashboard', icon: 'bar_chart', route: '/admin' },
      { name: 'Prospects', icon: 'business_center', route: '/admin/prospects' },
      { name: 'Interlocutors', icon: 'contacts', route: '/admin/interlocutors' },
      { name: 'Interactions', icon: 'forum', route: '/admin/interactions' },
    ],
  },
  crm: {
    icon: 'business_center', // Updated icon for CRM
    items: [
      { name: 'Dashboard', icon: 'bar_chart', route: '/admin/crm' },
      { name: 'Produits & Services', icon: 'inventory', route: '/crm/products', color: '#1976d2' },
      { name: 'Contrats', icon: 'assignment', route: '/crm/contracts', color: '#ff5722' },
      { name: 'Tarifs', icon: 'price_change', route: '/crm/pricing', color: '#4caf50' },
      { name: 'Devis', icon: 'request_quote', route: '/crm/quotes', color: '#ffc107' },
      { name: 'Commandes', icon: 'shopping_cart', route: '/crm/orders', color: '#673ab7' },
      { name: 'Bons de livraison', icon: 'local_shipping', route: '/crm/delivery-notes', color: '#2196f3' },
      { name: 'Factures', icon: 'receipt_long', route: '/admin/crm/invoices', color: '#9c27b0' },
      { name: 'Recouvrement', icon: 'account_balance_wallet', route: '/crm/collections', color: '#009688' },
      { name: 'Avoirs', icon: 'credit_score', route: '/crm/credits', color: '#f44336' },
    ],
  },
  tms: {
    icon: 'local_shipping',
    items: [
      { name: 'Deliveries', icon: 'local_shipping', route: '/tms/deliveries' },
      { name: 'Orders', icon: 'shopping_cart', route: '/tms/orders' },
    ],
  },
};

@Component({
  standalone: true,
  imports: [MatTreeModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule,
    MatListModule, MatDividerModule, RouterLink, RouterLinkWithHref, CdkTrapFocus, NgIf, MatCard, RouterLinkActive, NgForOf],
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit , AfterViewInit{
  user: any;
  currentRoute: string = '';
  activeRouteParams: any = {};
  activeQueryParams: any = {};
  selectedApplication: string = 'prospection';
  menuItems: MenuItem[] = menuData[this.selectedApplication].items;
  @ViewChild('rightDrawer') rightDrawer!: MatDrawer;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    // Retrieve user from local storage
    // this.user = this.localStorageService.getItem('user');
    // if (this.user) {
    //   this.user = JSON.parse(this.user);
    // } else {
    //   console.warn('User not found in localStorage.');
    // }

    // Update current route dynamically
    // this.router.events.subscribe(() => {
    //   this.currentRoute = this.router.url;
    // });

    // this.activeRoute.url.subscribe(([url]) => {
    //   const { path, parameters } = url;
    //   console.log(path); // e.g. /products
    //   console.log(parameters); // e.g. { id: 'x8klP0' }
    // });

    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        this.updateSelectedApplication();
      });

    // Initial setup
    this.updateSelectedApplication();

  }
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

        console.log('Active Route:', this.currentRoute);
        console.log('Route Parameters:', this.activeRouteParams);
        console.log('Query Parameters:', this.activeQueryParams);
      });
  }

  updateSelectedApplication(): void {
    // Match the active route to an application
    if (this.currentRoute.includes('/admin/prospection')) {
      this.selectApplication('prospection');
    } else if (this.currentRoute.includes('/admin/crm')) {
      this.selectApplication('crm');
    } else if (this.currentRoute.includes('/admin/tms')) {
      this.selectApplication('tms');
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

  protected readonly menuData = menuData;
}
