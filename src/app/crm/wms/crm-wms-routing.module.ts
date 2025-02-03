import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WmsNeedComponent} from './wms-need/wms-need.component';
import {WmsNeedCreatEditComponent} from './wms-need/wms-need-creat-edit/wms-need-creat-edit.component';
import {WmsNeedShowComponent} from './wms-need/wms-need-show/wms-need-show.component';
import {WmsIndexComponent} from './wms-index/wms-index.component';
import {WmsOfferComponent} from './wms-offer/wms-offer.component';
import {CreateEditWmsOfferComponent} from './wms-offer/create-edit-wms-offer/create-edit-wms-offer.component';
import {WmsOfferShowComponent} from './wms-offer/wms-offer-show/wms-offer-show.component';
import {ProspectComponent} from '../../admin/prospect/prospect.component';
import {WmsPricingComponent} from './pricing/wms-pricing/wms-pricing.component';




const routes: Routes = [
  {path:'', component: WmsIndexComponent, children:[
      {path:'needs', component: WmsNeedComponent},
      {path:'needs/create', component: WmsNeedCreatEditComponent},
      {path:'needs/show/:id', component: WmsNeedShowComponent },
      {path:'offers', component: WmsOfferComponent },
      {path:'offers/create', component: CreateEditWmsOfferComponent },
      {path:'offers/show/:id', component: WmsOfferShowComponent },
      {path:'customers', component: ProspectComponent },
      {path:'pricing', component: WmsPricingComponent },

    ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmWmsRoutingModule { }
