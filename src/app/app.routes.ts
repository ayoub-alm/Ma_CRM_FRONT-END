  import { Routes } from '@angular/router';
  import {LoginComponent} from './login/login.component';
  import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
    {path:'admin', loadChildren: async () => {
        const m = await import('./admin/admin.module');
        return m.AdminModule;}},
    {path:'login',component:LoginComponent},
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
