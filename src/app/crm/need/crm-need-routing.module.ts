import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NeedComponent} from './need.component';
import {WmsNeedComponent} from './wms-need/wms-need.component';
import {WmsNeedCreatEditComponent} from './wms-need/wms-need-creat-edit/wms-need-creat-edit.component';
import {TmsNeedShowComponent} from './tms-need/tms-need-show/tms-need-show.component';



const routes: Routes = [
  {path:'', component: NeedComponent, children:[
      {path:'wms', component: WmsNeedComponent},
      {path:'wms/create', component: WmsNeedCreatEditComponent},
      {path:'tms', component: TmsNeedShowComponent},
    ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmNeedRoutingModule { }
