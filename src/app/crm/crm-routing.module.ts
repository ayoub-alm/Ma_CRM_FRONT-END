import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InvoicesComponent} from './invoices/invoices.component';
import {NeedComponent} from './need/need.component';
import {WmsNeedComponent} from './need/wms-need/wms-need.component';
import {TmsNeedShowComponent} from './need/tms-need/tms-need-show/tms-need-show.component';
import {WmsNeedCreatEditComponent} from './need/wms-need/wms-need-creat-edit/wms-need-creat-edit.component';

const routes: Routes = [
  {path:'invoices', component: InvoicesComponent},
  {path:'need', loadChildren: () =>
      import('./need/crm.need.module').then((m) => m.CrmNeedModule), },
  {path:'pricing', loadChildren: () =>
      import('./pricing/pricing.module').then((m) => m.PricingModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
