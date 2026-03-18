import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceStatusPipe',
  standalone: true
})
export class InvoiceStatusPipe implements PipeTransform {

  transform(value: number, isStyle: boolean = false): string {

    if (value === 0)
      return "UnPaid";
    if (value === 1)
      return isStyle ? "PartiallyPaid" : "Partially Paid";
    if (value === 2)
      return "Paid";
    if (value === 3)
      return isStyle ? "OverDue" : "Over Due";

    return "Unkown";
  }

}
