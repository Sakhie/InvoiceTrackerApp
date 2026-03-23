import { ChangeDetectorRef, Component, Inject, OnInit, ElementRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InvoiceStatusPipe } from '../../pipes/invoice-status.pipe'
import { InvoiceCustomerPipe } from '../../pipes/invoice-customer.pipe'
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { UserService } from '../../services/users.service';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

const ELEMENT_DATA: Invoice[] = [];

@Component({
  selector: 'invoice-list',
  imports: [CommonModule, RouterLink, InvoiceStatusPipe, InvoiceCustomerPipe, MatPaginatorModule
    , MatTableModule, MatInputModule, MatFormFieldModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
  standalone: true
})
export class InvoiceListComponent implements OnInit, AfterViewInit {

  public invoices: Invoice[] = [];
  public customers: Customer[] = [];
  private invoiceStatuses: { [statusId: number]: string; } = {};
  private filterElement: any;
  private filterCaptionElement: any;

  
  public itemsPerPage: number = 5;
  
  displayedColumns: string[] = ['invoiceNumber', 'customer', 'invoiceDate', 'dueDate',
    'invoiceAmount', 'paidAmount', 'balance', 'status'];

  dataSource = new MatTableDataSource<Invoice>();
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private readonly invoiceService: InvoiceService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly customerService: CustomerService,
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
    public userService: UserService
  ) {
    const invoicesEndPoint = baseUrl + 'api/invoice/all';
    console.log("End point :" + invoicesEndPoint);    
  }

  pageEvent: PageEvent = null as unknown as PageEvent;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    //this.loadData(this.currentPage, this.pageSize);
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
    this.invoiceStatuses = ["UnPaid", "Partially Paid", "Paid", "Over Due"];
  }

  loadInvoices() {
    this.invoiceService.getAll()
      .subscribe((data) => {

        this.invoices = data;

        this.dataSource.data = data; // Assuming response has an 'items' array
        this.totalItems = data.length; // Assuming response has a 'totalCount' property

        this.changeDetectorRef.detectChanges();
      });
  }

  onRowClicked(row: any) {
    console.log("clicked..." + row.invoiceNumber);

    this.router.navigate(['/invoice-form/' + row.invoiceNumber]);
  }

  AddNew() {    
    this.router.navigate(['/invoice-form'])
  }

  filterBy(filterBy: string) {    
    console.log("filer el :" + this.filterElement.className);
    
    if (this.filterElement) {
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
