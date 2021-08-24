import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  forgotPassword(form:NgForm){
    if(form.invalid) {return}
    console.log("res")

    this.authService.forgotPassword(form.value.email)
    .subscribe(
      (res)=>{
        console.log(res)
      }
    )

  }
  
}
