import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProspectComponent } from './prospect/prospect.component';
import {ShowProspectComponent} from './prospect/show-prospect/show-prospect.component';
import {InterlocutorComponent} from './interlocutor/interlocutor.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {InterlocutorShowComponent} from './interlocutor/interlocutor-show/interlocutor-show.component';
import {InteractionComponent} from './interaction/interaction.component';
import {InteractionShowComponent} from './interaction/interaction-show/interaction-show.component';
import {IndexComponent} from '../index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'prospects', component: ProspectComponent },
      { path: 'prospects/:id', component: ShowProspectComponent },
      { path: 'interlocutors', component: InterlocutorComponent },
      { path: 'interlocutors/:id', component: InterlocutorShowComponent },
      { path: 'interactions', component: InteractionComponent },
      { path: 'interactions/:id', component: InteractionShowComponent },
      {
        path: 'crm',
        loadChildren: () =>
          import('../crm/crm.module').then((m) => m.CrmModule),
      },

    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Catch-all route to handle 404s
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
