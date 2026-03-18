import { ChangeDetectorRef, Component } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  public userToken: string;

  constructor(private readonly localStorageService: LocalStorageService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.userToken = localStorageService.getItem("userToken").subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
    

    console.log("nav.....token: " + this.userToken);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {

    this.localStorageService.removeItem("userToken").subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });    

    console.log("logging out.........");
    this.router.navigate(['']);
  }
}
