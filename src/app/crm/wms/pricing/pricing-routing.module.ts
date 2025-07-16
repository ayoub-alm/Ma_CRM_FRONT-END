import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PricingComponent} from "./pricing.component";
import {WmsPricingComponent} from "./wms-pricing/wms-pricing.component";
import {AddEditProvisionDialogComponent} from './add-edit-provision-dialog/add-edit-provision-dialog.component';

const routes: Routes = [
  {path:'', component: PricingComponent, children:[
      {path:'unloading', component: WmsPricingComponent},
      {path:'provision', component: AddEditProvisionDialogComponent}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
