import { Component, OnInit, LOCALE_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'customer-form',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  standalone: true
})
export class CustomerFormComponent implements OnInit {

  customerForm: FormGroup;
  currentId?: number;
  public isLoading: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(LOCALE_ID) private readonly local: string,
    public userService: UserService
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
    this.isLoading = !this.isLoading;

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

        this.router.navigate(['/customer-list']);
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
        this.router.navigate(['/customer-list']);
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
            this.router.navigate(['/customer-list']);
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
