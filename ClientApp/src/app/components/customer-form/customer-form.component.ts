import { Component, OnInit, LOCALE_ID, Inject, inject, ChangeDetectorRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'customer-form',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  standalone: true
})
export class CustomerForm implements OnInit {

  customerForm: FormGroup;
  currentId?: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(LOCALE_ID) private local: string
  ) {

    this.customerForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.currentId = +id;
      console.log("details form..." + this.currentId);
      this.loadDetails(this.currentId);
    } else {
      console.log("new form..." + this.currentId);
    }
  }

  loadDetails(id: number) {
    this.customerService.get(id).subscribe({
      //if success
      next: (customer) => {
        console.log("item ..." + customer.id);

        this.customerForm.patchValue({       
          customerName: customer.name,
          customerNumber: customer.number
        })
      },

      //if failer
      error: (error) => {
        console.log("failed getting item: " + error);
      }

    });
  }

  submitForm() {
    if (this.currentId) {
      this.updateDetails(this.currentId);
    } else {
      this.createNew();
    }
  }

  createNew() {
    console.log('to create...name:'
      + this.customerForm.get('customerName')?.value
      + ', number:' + this.customerForm.get('customerNumber')?.value
    );

    const cust = this.customerForm.value;
    console.log("form call... " + cust);

    this.customerService.addNew(
      {
        id: 0,
        name: this.customerForm.get('customerName')?.value,
        number: this.customerForm.get('customerNumber')?.value
      }
    ).subscribe((data) => {
      if (data && data.id > 0) {
        console.log("Successfully created...");

        this.router.navigate(['/customer']);
      } else {
        console.log("Something went wrong...");
      }
    });
  }

  updateDetails(id: number) {
    console.log('to update...name:'
      + this.customerForm.get('customerName')?.value
      + ', number:' + this.customerForm.get('customerNumber')?.value
    );

    const cust = this.customerForm.value;
    console.log("form call... " + cust);

    this.customerService.update(
      {
        id: id,
        name: this.customerForm.get('customerName')?.value,
        number: this.customerForm.get('customerNumber')?.value
      }
    ).subscribe((updated) => {
      if (updated) {
        this.router.navigate(["/customers"]);
      } else {
        console.log("Something went wrong...");
      }
    });
  }

  deleteCustomer() {
    if (this.currentId) {
      const toDelete = confirm("Are you sure to delete this item");
      console.log("Answer..." + toDelete);

      if (toDelete) {

        this.customerService.delete(this.currentId).subscribe((deleted) => {
          if (deleted) {
            this.router.navigate(["/customers"]);
          } else {
            console.log("Something went wrong...");
          }
        });

      } else {
        console.log("cancelling...");
      }
    }
  }

}
