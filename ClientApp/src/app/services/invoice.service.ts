import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {

  private readonly _baseUrl: string;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl + 'api/invoice';
  }

  getAll(): Observable<Invoice[]> {

    const endpoint = this._baseUrl + "/all";
    console.log("all Service endpoint: " + endpoint);

    return this.http.get<Invoice[]>(endpoint);
  }

  addNew(invoice: Invoice): Observable<Invoice> {
    console.log('service call...(' + invoice.invoiceNumber + ", " + invoice.invoiceAmount + ")");

    const endpoint = this._baseUrl + "/add";
    console.log("add service endpoint: " + endpoint);

    return this.http.post<Invoice>(endpoint, invoice);
  }

  update(invoice: Invoice): Observable<boolean> {
    console.log('update service call...(' + invoice.invoiceNumber + ", " + invoice.invoiceAmount + ")");

    return this.http.put<boolean>(
      this._baseUrl + "/update", invoice);
  }

  get(id: number): Observable<Invoice> {

    const endpoint = this._baseUrl + "/get/" + id;
    console.log("get service endpoint: " + endpoint);

    return this.http.get<Invoice>(endpoint);
  }

  delete(id: number): Observable<boolean> {

    const endpoint = this._baseUrl + "/delete/" + id;
    console.log("delete service endpoint: " + endpoint);

    return this.http.delete<boolean>(endpoint);
  }

}
