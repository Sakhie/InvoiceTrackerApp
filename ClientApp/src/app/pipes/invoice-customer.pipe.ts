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
    const customer = customers.find(x => x.id == value);
    if (customer) {
      return customer.name;
    }
    return "";
  }

}
