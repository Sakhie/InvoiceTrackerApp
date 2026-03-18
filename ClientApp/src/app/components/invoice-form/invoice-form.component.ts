import { Component, OnInit, LOCALE_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'invoice-form',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css'],
  standalone: true
})
export class InvoiceFormComponent implements OnInit {

  invoiceForm: FormGroup;
  currentId?: number;
  public customers: Customer[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly invoiceService: InvoiceService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly customerService: CustomerService,
    @Inject(LOCALE_ID) private readonly local: string
  ) {

    this.invoiceForm = this.formBuilder.group({
      customerId: new FormControl('', Validators.required),
      dueDate: new FormControl('', Validators.required),
      invoiceAmount: new FormControl('', Validators.required),
      paidAmount: new FormControl('', Validators.required)
    });

    /*
    this.invoiceForm = this.formBuilder.group({
      customerId: ['', Validators.required],
      dueDate: ['', Validators.required],
      invoiceAmount: ['', Validators.required, Validators.min(0)],
      paidAmount: ['', Validators.required]
    });
    */
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadCustomers();

    if (id) {
      this.currentId = +id;
      console.log("details form..." + this.currentId);
      this.loadDetails(this.currentId);
    } else {
      console.log("new form..." + this.currentId);
    }
  }

  loadCustomers() {
    this.customerService.getAll()
      .subscribe((data) => {
        console.log("Pipe ...found data " + data.length);
        this.customers = data;
        this.changeDetectorRef.detectChanges();
      });
  }

  loadDetails(id: number) {
    this.invoiceService.get(id).subscribe({

      //if success
      next: (invoice) => {
        console.log("item ..." + invoice.invoiceNumber);
        
        this.invoiceForm.patchValue({
          invoiceNumber: invoice.invoiceNumber,
          customerId: invoice.customerId,
          invoiceDate: formatDate(invoice.invoiceDate, 'yyyy-MM-dd', this.local),
          dueDate: formatDate(invoice.dueDate, 'yyyy-MM-dd', this.local),
          invoiceAmount: invoice.invoiceAmount,
          paidAmount: invoice.paidAmount
        });
                
        //document.getElementById("customerId")?.classList.add("customer-select");
        
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
      + this.invoiceForm.get('invoiceName')?.value
      + ', number:' + this.invoiceForm.get('invoiceNumber')?.value
    );

    const cust = this.invoiceForm.value;
    console.log("form call... " + cust);

    this.invoiceService.addNew(
      {
        invoiceNumber: 0,
        customerId: this.invoiceForm.get('customerId')?.value,
        invoiceDate: new Date(),
        dueDate: this.invoiceForm.get('dueDate')?.value,
        invoiceAmount: this.invoiceForm.get('invoiceAmount')?.value,
        paidAmount: this.invoiceForm.get('paidAmount')?.value,
        statusId: 0,
        balance:0
      }
    ).subscribe((data) => {
      if (data && data.invoiceNumber > 0) {
        console.log("Successfully created...");

        this.router.navigate(['/invoice-list']);
      } else {
        console.log("Something went wrong...");
      }
    });
  }

  updateDetails(id: number) {
    console.log('to update...name:'
      + this.invoiceForm.get('invoiceName')?.value
      + ', number:' + this.invoiceForm.get('invoiceNumber')?.value
    );

    const cust = this.invoiceForm.value;
    console.log("form call... " + cust);

    this.invoiceService.update(
      {
        invoiceNumber: id,
        customerId: 0,
        dueDate: this.invoiceForm.get('dueDate')?.value,
        invoiceAmount: this.invoiceForm.get('invoiceAmount')?.value,
        paidAmount: this.invoiceForm.get('paidAmount')?.value,
        statusId: 0,
        balance: 0,
        invoiceDate: new Date()
      }
    ).subscribe((updated) => {
      if (updated) {
        this.router.navigate(['/invoice-list']);
      } else {
        console.log("Something went wrong...");
      }
    });
  }

  deleteinvoice() {
    if (this.currentId) {
      const toDelete = confirm("Are you sure to delete this item");
      console.log("Answer..." + toDelete);

      if (toDelete) {

        this.invoiceService.delete(this.currentId).subscribe((deleted) => {
          if (deleted) {
            this.router.navigate(['/invoice-list']);
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
