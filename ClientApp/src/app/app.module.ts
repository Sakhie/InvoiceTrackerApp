import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    CustomerListComponent,
    CustomerFormComponent,
    InvoiceListComponent,
    InvoiceFormComponent,
    Login,
    Signup,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'customer-list', component: CustomerListComponent },
      { path: 'customer-form', component: CustomerFormComponent },
      { path: 'customer-form/:id', component: CustomerFormComponent },
      { path: 'invoice-list', component: InvoiceListComponent },
      { path: 'invoice-form', component: InvoiceFormComponent },
      { path: 'invoice-form/:id', component: InvoiceFormComponent },

      { path: 'signup', component: Signup },
      { path: 'login', component: Signup }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
