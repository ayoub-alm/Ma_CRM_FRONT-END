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
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatDivider, MatDividerModule} from '@angular/material/divider';
import {
  MatTree,
  MatTreeModule, MatTreeNestedDataSource,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle
} from '@angular/material/tree';
import {MatList, MatListItem, MatListModule} from '@angular/material/list';
import {filter} from 'rxjs';
import {NestedTreeControl} from '@angular/cdk/tree';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  color?: string | "black";
  children?: string[] | [];
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
  admin: {
    icon: 'admin_panel_settings',
    items: [
      { name: ' Entreprises', icon: 'domain', route: '/super-admin/companies' },
      { name: 'Utilisateur', icon: 'person', route: '/super-admin/users' },
      { name: 'Project', icon: 'work_outline ', route: '/super-admin/projects' },
      { name: 'Taxonomie', icon: 'person', route: '/super-admin/users', children: ["test", "test"] },
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

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

@Component({
  selector: 'app-super-admin-index',
  standalone: true,
  imports: [
    MatButton,
    MatDivider,
    MatDrawer,
    MatDrawerContainer,
    MatIcon,
    MatIconButton,
    MatList,
    MatListItem,
    MatToolbar,
    NgForOf,
    NgIf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatTreeNode,
    MatTree,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle
  ],
  templateUrl: './super-admin-index.component.html',
  styleUrl: './super-admin-index.component.css'
})
export class SuperAdminIndexComponent implements OnInit , AfterViewInit{
  user: any;
  currentRoute: string = '';
  activeRouteParams: any = {};
  activeQueryParams: any = {};
  selectedApplication: string = 'prospection';
  menuItems: MenuItem[] = menuData[this.selectedApplication].items;
  @ViewChild('rightDrawer') rightDrawer!: MatDrawer;
  // TreeControl for nested structure
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);

  // DataSource for tree
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}



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
    this.dataSource.data = TREE_DATA;
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
    }
    else if (this.currentRoute.includes('/admin/super-admin')) {
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

  protected readonly menuData = menuData;

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}

