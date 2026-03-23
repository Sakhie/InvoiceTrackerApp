import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { Signup } from './components/signup/signup';
import { AuthGuard } from './guards/auth.guard';
import { authInterceptor } from './interceptors/auth.interceptor';
import { allInterceptor } from './interceptors/all.interceptor';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    MatPaginatorModule, MatTableModule, MatInputModule, MatFormFieldModule,

    NavMenuComponent,
    CustomerListComponent,
    CustomerFormComponent,
    InvoiceListComponent,
    InvoiceFormComponent,
    Signup,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'customer-list', component: CustomerListComponent, canActivate: [AuthGuard] },
      { path: 'customer-form', component: CustomerFormComponent, canActivate: [AuthGuard] },
      { path: 'customer-form/:id', component: CustomerFormComponent, canActivate: [AuthGuard] },
      { path: 'invoice-list', component: InvoiceListComponent, canActivate: [AuthGuard] },
      { path: 'invoice-form', component: InvoiceFormComponent, canActivate: [AuthGuard] },
      { path: 'invoice-form/:id', component: InvoiceFormComponent, canActivate: [AuthGuard] },

      { path: 'signup', component: Signup },
      { path: 'login', component: Signup }
    ]),
    BrowserAnimationsModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, allInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
