import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InvoicesComponent} from './invoices/invoices.component';

const routes: Routes = [
  {path:'invoices', component: InvoicesComponent},
  {path:'wms', loadChildren: () => import('./wms/crm.wms.module').then((m) => m.CrmWmsModule), },
  // {path:'pricing', loadChildren: () =>
  //     import('./pricing/pricing.module').then((m) => m.PricingModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
