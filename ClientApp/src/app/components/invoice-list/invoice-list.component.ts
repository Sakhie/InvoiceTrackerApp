import { ChangeDetectorRef, Component, Inject, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InvoiceStatusPipe } from '../../pipes/invoice-status.pipe'
import { InvoiceCustomerPipe } from '../../pipes/invoice-customer.pipe'
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'invoice-list',
  imports: [CommonModule, RouterLink, InvoiceStatusPipe, InvoiceCustomerPipe],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
  standalone: true
})
export class InvoiceListComponent implements OnInit{
  public invoices: Invoice[] = [];
  public customers: Customer[] = [];
  private invoiceStatuses: { [statusId: number]: string; } = {};
  private filterElement: any;
  private filterCaptionElement: any;

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private readonly invoiceService: InvoiceService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly customerService: CustomerService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    const invoicesEndPoint = baseUrl + 'api/invoice/all';
    console.log("End point :" + invoicesEndPoint);    
  }

  ngOnInit(): void {

    this.filterElement = document.getElementById('filter')!;
    this.filterCaptionElement = document.getElementById('filter-caption')!;

    this.loadInvoiceStatuses();
    this.loadInvoices();
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAll()
      .subscribe((data) => {
        console.log("Pipe ...found data " + data.length);
        this.customers = data;
        this.changeDetectorRef.detectChanges();
      });
  }

  loadInvoiceStatuses() {
    this.invoiceStatuses[0] = "UnPaid";
    this.invoiceStatuses[1] = "Partially Paid";
    this.invoiceStatuses[2] = "Paid";
    this.invoiceStatuses[3] = "Over Due";
  }

  loadInvoices() {
    this.invoiceService.getAll()
      .subscribe((data) => {

        this.invoices = data;
        console.log('list...items:' + this.invoices.length);

        this.changeDetectorRef.detectChanges();
      });
  }

  viewDetails(id: number) {
    this.router.navigate(['/invoice-form/' + id])
  }

  AddNew() {    
    this.router.navigate(['/invoice-form'])
  }

  filterBy(filterBy: string) {    
    console.log("filer el :" + this.filterElement.className);
    
    if (this.filterElement) {
      //this.filterElement.style.display = '';
      this.renderer.removeClass(this.filterElement, 'filter');
    }

    if (this.filterCaptionElement) {
      this.filterCaptionElement.innerText = "Filtered by: " + filterBy;
    }

    const elements = this.elementRef.nativeElement.querySelectorAll('.trans-row');
    elements.forEach((element: HTMLElement) => {
      if (element.classList.contains(filterBy)) {
        element.style.display = '';        
      } else {
        element.style.display = 'none';
      }
    });
  }

  clearFilter() {
    const elements = this.elementRef.nativeElement.querySelectorAll('.trans-row');
    elements.forEach((element: HTMLElement) => {
      element.style.display = '';
    });

    //this.filterElement.style.display = 'none';
    this.renderer.addClass(this.filterElement, 'filter');
  }

  getSummaryByStatusId(statusId: number): number {
    return this.invoices.filter(x => x.statusId === statusId).length;      
  }

  getBalanceSummary(): number {
    return this.invoices.filter(x => x.balance)
      .reduce((sum, t) => sum + t.balance, 0);
  }

  getPaidSummary(): number {
    return this.invoices.filter(x => x.paidAmount)
      .reduce((sum, t) => sum + t.paidAmount, 0);
  }


}
