import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { Customer } from '../models/customer';

@Pipe({
  name: 'invoiceCustomerPipe',
  standalone: true
})
export class InvoiceCustomerPipe implements PipeTransform {

  
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    
  }

  

  transform(value: number, customers: Customer[]): string {

    console.log("Pipe..." + value);
    const customer = customers.find(x => x.id == value);
    if (customer) {
      console.log("Pipe 2..." + customer.name);
      return customer.name;
    }

    console.log("Pipe 3..." + customers.length);
    return "";
  }

}
