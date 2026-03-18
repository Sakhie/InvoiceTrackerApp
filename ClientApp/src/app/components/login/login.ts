import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true
})
export class Login implements OnInit {

  ngOnInit():void{
    console.log('login...');
  }
  
  
}
