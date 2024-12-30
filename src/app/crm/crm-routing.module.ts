import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InvoicesComponent} from './invoices/invoices.component';
import {NeedComponent} from './need/need.component';
import {WmsNeedComponent} from './need/wms-need/wms-need.component';
import {TmsNeedShowComponent} from './need/tms-need/tms-need-show/tms-need-show.component';

const routes: Routes = [
  {path:'invoices', component: InvoicesComponent},
  {path:'need', component: NeedComponent, children:[
      {path:'wms', component: WmsNeedComponent},
      {path:'tms', component: TmsNeedShowComponent},
    ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
