import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WmsNeedComponent } from './wms-need/wms-need.component';
import { WmsNeedCreatEditComponent } from './wms-need/wms-need-creat-edit/wms-need-creat-edit.component';
import { WmsNeedShowComponent } from './wms-need/wms-need-show/wms-need-show.component';
import { WmsIndexComponent } from './wms-index/wms-index.component';
import { WmsOfferComponent } from './wms-offer/wms-offer.component';
import { CreateEditWmsOfferComponent } from './wms-offer/create-edit-wms-offer/create-edit-wms-offer.component';
import { WmsOfferShowComponent } from './wms-offer/wms-offer-show/wms-offer-show.component';
import { ProspectComponent } from '../../admin/prospect/prospect.component';
import { WmsPricingComponent } from './pricing/wms-pricing/wms-pricing.component';
import { WmsContractComponent } from './wms-contract/wms-contract.component';
import { WmsContractShowComponent } from './wms-contract/wms-contract-show/wms-contract-show.component';
import { WmsInvoiceCreateComponent } from './wms-invoice/wms-invoice-create/wms-invoice-create.component';
import {
  WmsDeliveryNoteCreateComponent
} from './wms-delivry-note/wms-delivery-note-create/wms-delivery-note-create.component';
import { WmsDeliveryNoteComponent } from './wms-delivry-note/wms-delivery-note.component';
import {
  WmsDeliveryNoteShowEditComponent
} from './wms-delivry-note/wms-delivery-note-show-edit/wms-delivery-note-show-edit.component';
import { WmsInvoiceShowComponent } from './wms-invoice/wms-invoice-show/wms-invoice-show.component';
import { WmsInvoiceComponent } from './wms-invoice/wms-invoice.component';
import { WmsAnnexeComponent } from './wms-contract/wms-annexe/wms-annexe.component';
import { WmsAssetComponent } from './wms-asset/wms-asset.component';
import { WmsCreditNoteShowComponent } from './wms-asset/wms-credit-note-show/wms-credit-note-show.component';
import { WmsPaymentComponent } from './wms-payment/wms-payment.component';
import { WmsPaymentShowComponent } from './wms-payment/wms-payment-show/wms-payment-show.component';
import { WmsDashboardComponent } from './wms-dashboard/wms-dashboard.component';




const routes: Routes = [
  {
    path: '', component: WmsIndexComponent, children: [
      { path: 'dashboard', component: WmsDashboardComponent },
      { path: 'needs', component: WmsNeedComponent },
      { path: 'needs/create', component: WmsNeedCreatEditComponent },
      { path: 'needs/show/:id', component: WmsNeedShowComponent },
      { path: 'offers', component: WmsOfferComponent },
      { path: 'offers/create', component: CreateEditWmsOfferComponent },
      { path: 'offers/show/:id', component: WmsOfferShowComponent },
      { path: 'customers', component: ProspectComponent },
      { path: 'pricing', component: WmsPricingComponent },
      { path: 'contracts', component: WmsContractComponent },
      { path: 'contracts/show/:id', component: WmsContractShowComponent },
      { path: 'contracts/annexe/:id', component: WmsAnnexeComponent },
      { path: 'delivery-note', component: WmsDeliveryNoteComponent },
      { path: 'delivery-note/create', component: WmsDeliveryNoteCreateComponent },
      { path: 'delivery-note/show/:id', component: WmsDeliveryNoteShowEditComponent },
      { path: 'invoice', component: WmsInvoiceComponent },
      { path: 'invoice/create', component: WmsInvoiceCreateComponent },
      { path: 'invoice/show/:id', component: WmsInvoiceShowComponent },
      { path: 'assets', component: WmsAssetComponent },
      { path: 'assets/show/:id', component: WmsCreditNoteShowComponent },
      { path: 'payments', component: WmsPaymentComponent },
      { path: 'payments/show/:id', component: WmsPaymentShowComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmWmsRoutingModule { }
