import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  standalone: true
})
export class NavMenuComponent {

  isExpanded = false;
  public userToken: string | undefined;
  public currentUserInfo: any;

  constructor(
    public userService: UserService
  ) {
    
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
