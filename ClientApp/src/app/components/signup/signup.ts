import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/users.service';
import { UserResponse } from '../../models/userResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  standalone: true
})
export class Signup implements OnInit {

  signupForm: FormGroup;
  public token: string = "";
  public isLogin: boolean = false;
  public isLoading: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService
  ) {

    this.signupForm = this.formBuilder.group({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {
    console.log("url..." + this.router.url);

    if (this.router.url.endsWith("login")) {
      this.isLogin = true;
    }
  }

  submit() {

    this.isLoading = !this.isLoading;

    const thisUser = {
      id: crypto.randomUUID(),
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value
    };

    const jsonString: string = JSON.stringify(thisUser);
    console.log('to signup...name:' + jsonString);
    
    if (this.isLogin) {
      this.userService.signin(thisUser).subscribe((data) => {
        this.postSubmit(data);
      });
    }
    else
    { 
      this.userService.signup(thisUser).subscribe((data) => {
        this.postSubmit(data);
      });
    }
    
  }

  postSubmit(userResponse: UserResponse) {
    if (userResponse) {
      this.token = userResponse.token;
      console.log("Successfully logged in...token:" + userResponse.token);      

      this.router.navigate(['/invoice-list']);
    } else {
      console.log("Something went wrong...");
    }
  }


}
