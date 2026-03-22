import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { UserResponse } from '../models/userResponse';
import { LocalStorageService } from '../services/local-storage.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TokenClaims } from '../models/tokenClaims';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly _baseUrl: string;
  private readonly currentUserSubject = new BehaviorSubject<string | null>(null);
  private readonly currentUserRoleSubject = new BehaviorSubject<string | null>(null);

  private readonly currentUserInfoSubject = new BehaviorSubject<TokenClaims | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  currentUserRole$ = this.currentUserRoleSubject.asObservable();

  currentUserInfo$ = this.currentUserInfoSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private readonly localStorageService: LocalStorageService,
    private readonly router: Router
  ) {
      this._baseUrl = baseUrl + 'api/user';

      const token = localStorageService.getItem("userToken");
      if (token) {
        this.currentUserSubject.next('user');
      }
  }

  signup(user: User): Observable<UserResponse> {

    const jsonString: string = JSON.stringify(user);
    console.log('service call...(' + jsonString + ")");

    const endpoint = this._baseUrl + "/signup";
    console.log("signup user endpoint: " + endpoint);

    return this.http.post<UserResponse>(endpoint, user)
      .pipe(
        tap((response) => {
          this.userInfo(response.token);
          
        })
      )
  }

  signin(user: User): Observable<UserResponse> {

    const jsonString: string = JSON.stringify(user);
    console.log('service call...(' + jsonString + ")");

    const endpoint = this._baseUrl + "/signin";
    console.log("login user endpoint: " + endpoint);

    return this.http.post<UserResponse>(endpoint, user)
      .pipe(
        tap((response) => {
          this.userInfo(response.token);          
        })
      )
  }

  userInfo(token: string | null): void {
    if (token) {

      this.localStorageService.setItem('userToken', token);
      this.currentUserSubject.next('user');

      try {
        const decodedClaims = jwtDecode<TokenClaims>(token);

        console.log("Name:", decodedClaims.NameIdentifier +
          ", Email:" + decodedClaims.EmailAddress +
          "role:" + decodedClaims.Role);

        this.localStorageService.setItem('userEmail', decodedClaims.EmailAddress);
        if (decodedClaims?.Role) {
          this.localStorageService.setItem('userRole', decodedClaims.Role);
          if (decodedClaims.Role == "admin") {
            this.currentUserRoleSubject.next('admin');
          }
        }

      } catch (error) {
        console.error('Error decoding token (checkRoles):', error);
      }
    }
  }

  isAuthenticated(): boolean{
    return !!this.localStorageService.getItem("userToken");
  }

  logout(): void {
    this.localStorageService.removeItem('userToken');
    this.localStorageService.removeItem('userRole');
    this.localStorageService.removeItem('userEmail');

    this.currentUserSubject.next(null);
    this.currentUserRoleSubject.next(null);

    this.router.navigate(['']);
  }

  getToken(): string | null {
    return this.localStorageService.getItem("userToken");
  }
}
