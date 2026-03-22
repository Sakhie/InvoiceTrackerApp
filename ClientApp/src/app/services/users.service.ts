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
  private readonly currentUserInfoSubject = new BehaviorSubject<TokenClaims | null>(null);
  currentUserInfo$ = this.currentUserInfoSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private readonly localStorageService: LocalStorageService,
    private readonly router: Router
  ) {
      this._baseUrl = baseUrl + 'api/user';
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

      const currentUser: TokenClaims = {
        NameIdentifier: "",
        EmailAddress: "",
        Role: ""
      };

      this.localStorageService.setItem('userToken', token);
      try {
        const decodedClaims = jwtDecode<TokenClaims>(token);        

        console.log("Name:", decodedClaims.NameIdentifier +
          ", Email:" + decodedClaims.EmailAddress +
          "role:" + decodedClaims.Role);

        currentUser.NameIdentifier = decodedClaims.NameIdentifier;
        currentUser.EmailAddress = decodedClaims.EmailAddress;
        if (decodedClaims?.Role) {
          currentUser.Role = decodedClaims?.Role;
        }
        this.currentUserInfoSubject.next(currentUser);

        this.localStorageService.setItem('userInfo', currentUser);

      } catch (error) {
        console.error('Error decoding token (checkRoles):', error);
      }
    }
  }

  

  logout(): void {
    this.localStorageService.removeItem('userToken');
    this.localStorageService.removeItem('userInfo');
    this.currentUserInfoSubject.next(null);

    this.router.navigate(['']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  getToken(): string | null {
    return this.localStorageService.getItem("userToken");
  }
  getUserInfo(): TokenClaims | null {
    return this.localStorageService.getItem("userInfo");
  }
  isAdmin() {
    return this.getUserInfo()?.Role == 'admin';
  }
  userDisplayName() {
    return this.getUserInfo()?.EmailAddress;
  }

}
