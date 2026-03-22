import { Component, DoCheck, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { TokenClaims } from '../../models/tokenClaims';

@Component({
  selector: 'app-nav-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  standalone: true
})
export class NavMenuComponent implements OnInit, DoCheck {

  isExpanded = false;
  public userToken: string | undefined;

  public currentUserInfo: TokenClaims | null = {
    NameIdentifier: "",
    EmailAddress: "",
    Role: ""
  };

  constructor(
    public userService: UserService
  ) {
    
  }

  ngDoCheck(): void {
    //this.getInfo("ngDoCheck");
  }

  ngOnInit(): void {
    this.getInfo("ngOnInit");
  }

  getInfo(stringFrom: string) {

    this.currentUserInfo = this.userService.getUserInfo();

    console.log("From localstore on nav (" + stringFrom + " ) " + JSON.stringify(this.currentUserInfo));
    /*
    this.userService.currentUserInfo$.subscribe(value => {
      this.currentUserInfo = value;
      console.log("From observable on nav (" + stringFrom +" ) " + JSON.stringify(value));
    });*/
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.userService.logout();
  }
}
