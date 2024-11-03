import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { PageCreateGroupComponent } from './group/pages/page-create-group/page-create-group.component';
import { HomeComponent } from "./pockets/pages/home/home.component";
import { PageGroupComponent } from "./group/pages/page-group/page-group.component";
import { IncomingComponent } from "./payments/incoming/pages/incoming.component";
import { OutgoingComponent } from "./payments/outgoing/pages/outgoing.component";
import { ContactComponent } from "./contacts/pages/contact/contact.component";
import { PageExpensesComponent } from './expenses/pages/page-expenses/page-expenses.component';
import { AddExpenseComponent } from './expenses/pages/add-expense/add-expense.component';
import { PageGroupDetailsComponent } from './group/pages/page-group-details/page-group-details.component';
import { AddPaymentComponent } from "./payments/incoming/pages/add-payment/add-payment.component";
import { authenticationGuard } from "./iam/services/authentication.guard";
import { SignInComponent } from "./iam/pages/sign-in/sign-in.component";
import { SignUpComponent } from "./iam/pages/sign-up/sign-up.component";
import {
  PageGroupExpensesDetailsComponent
} from "./group/pages/page-group-expenses-details/page-group-expenses-details.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [authenticationGuard], },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'groups', component: PageGroupComponent, canActivate: [authenticationGuard], },
  { path: 'group-detail/:id', component: PageGroupDetailsComponent, canActivate: [authenticationGuard], },
  { path: 'profile', component: ContactComponent, canActivate: [authenticationGuard], },
  { path: 'incoming', component: IncomingComponent, canActivate: [authenticationGuard], },
  { path: 'outgoing', component: OutgoingComponent, canActivate: [authenticationGuard], },
  { path: 'create-group', component: PageCreateGroupComponent, canActivate: [authenticationGuard], },
  { path: 'expenses', component: PageExpensesComponent, canActivate: [authenticationGuard], },
  { path: 'expenses/add-expense', component: AddExpenseComponent, canActivate: [authenticationGuard], },
  { path: 'outgoing/add-payment', component: AddPaymentComponent, canActivate: [authenticationGuard], },
  { path: 'page-group-expenses-details/:id', component: PageGroupExpensesDetailsComponent, canActivate: [authenticationGuard],},
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '*', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
