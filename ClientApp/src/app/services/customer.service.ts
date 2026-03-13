import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  private readonly _baseUrl: string;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl + 'api/customer';    
  }

  getAll(): Observable<Customer[]> {

    const endpoint = this._baseUrl + "/all";
    console.log("all Service endpoint: " + endpoint);

    return this.http.get<Customer[]>(endpoint);
  }

  addNew(customer: Customer): Observable<Customer> {
    console.log('service call...(' + customer.id + ", " + customer.name + ")");

    const endpoint = this._baseUrl + "/add";
    console.log("add service endpoint: " + endpoint);

    return this.http.post<Customer>(endpoint, customer);
  }

  update(customer: Customer): Observable<boolean> {
    console.log('update service call...(' + customer.id + ", " + customer.name +")");

    return this.http.put<boolean>(
      this._baseUrl + "/update", customer);
  }

  get(id: number): Observable<Customer> {

    const endpoint = this._baseUrl + "/get/" + id;
    console.log("get service endpoint: " + endpoint);

    return this.http.get<Customer>(endpoint);
  }

  delete(id: number): Observable<boolean> {

    const endpoint = this._baseUrl + "/delete/" + id;
    console.log("delete service endpoint: " + endpoint);

    return this.http.delete<boolean>(endpoint);
  }

}
