import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/users.service';
import { UserResponse } from '../../models/userResponse';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  standalone: true
})
export class Signup implements OnInit {

  signupForm: FormGroup;
  public token: string = "";
  public isLogin: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private localStorageService: LocalStorageService
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

    const thisUser = {
      id: "e17bb89d-516b-4d23-9e44-3b17b31668e0",
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

      this.localStorageService.setItem("userToken", userResponse.token);

      console.log("Successfully logged in...token:" + userResponse.token);

      this.router.navigate(['/invoice-list']);
    } else {
      console.log("Something went wrong...");
    }
  }


}
