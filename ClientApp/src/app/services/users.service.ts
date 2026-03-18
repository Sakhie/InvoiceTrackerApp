import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserResponse } from '../models/userResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly _baseUrl: string;
  constructor(private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string
  ) {
    this._baseUrl = baseUrl + 'api/user';    
  }

  signup(user: User): Observable<UserResponse> {

    const jsonString: string = JSON.stringify(user);
    console.log('service call...(' + jsonString + ")");

    const endpoint = this._baseUrl + "/signup";
    console.log("signup user endpoint: " + endpoint);

    const token = this.http.post<UserResponse>(endpoint, user);

    console.log('service response...token (' + token + ")");
    return token;
  }

  signin(user: User): Observable<UserResponse> {

    const jsonString: string = JSON.stringify(user);
    console.log('service call...(' + jsonString + ")");

    const endpoint = this._baseUrl + "/signin";
    console.log("login user endpoint: " + endpoint);

    return this.http.post<UserResponse>(endpoint, user);
  }

  test(): Observable<string> {
    console.log('service call...');

    const endpoint = this._baseUrl + "/test";
    console.log("test endpoint: " + endpoint);

    return this.http.get<string>(endpoint);
  }

  
}
