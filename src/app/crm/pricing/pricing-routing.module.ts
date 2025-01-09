import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PricingComponent} from "./pricing.component";
import {WmsPricingComponent} from "./wms-pricing/wms-pricing.component";

const routes: Routes = [
  {path:'', component: PricingComponent, children:[
      {path:'wms', component: WmsPricingComponent},
      {path:'tms', component: WmsPricingComponent}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
