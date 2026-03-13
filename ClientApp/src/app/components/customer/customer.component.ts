import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'customer',
  imports: [CommonModule, RouterLink],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  standalone: true
})
export class CustomerComponent implements OnInit{
  public customers: Customer[] = [];

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private customerService: CustomerService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {

    const customersEndPoint = baseUrl + 'api/customer/all';
    console.log("End point :" + customersEndPoint);    
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.customerService.getAll()
      .subscribe((data) => {
        this.customers = data;
        console.log('list...items:' + this.customers.length);

        this.changeDetectorRef.detectChanges();
      });
  }

  viewDetails(id: number) {
    this.router.navigate(['/customer-form/' + id])
  }

  AddNew() {    
    this.router.navigate(['/customer-form'])
  }

  incomeSummary(): number {
    return 0;
  }

  expenseSummary(): number {
    return 0;
  }

  filterBy(filterBy: string) {
  }



}
