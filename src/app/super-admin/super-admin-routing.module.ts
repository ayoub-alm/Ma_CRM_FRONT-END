import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InvoicesComponent} from '../crm/invoices/invoices.component';
import {UsersComponent} from './users/users.component';
import {CompaniesComponent} from './companies/companies.component';
import {SuperAdminIndexComponent} from './super-admin-index/super-admin-index.component';
import {ProjectComponent} from './project/project.component';
import {IndexComponent} from '../index/index.component';



const routes: Routes = [
  {
    path: '', component:IndexComponent,
    children: [
      { path: '', component: SuperAdminIndexComponent }, // Index
      { path: 'users', component: UsersComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'projects', component: ProjectComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
