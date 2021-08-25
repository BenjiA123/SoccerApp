import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private authService:AuthService,private route:ActivatedRoute, private router: Router) { }

  token:string
  ngOnInit() {
    this.route.params
    .subscribe(
      (params:Params)=>{
        this.token = params['token']
      }
    )
  }

  resetPassword(form:NgForm){
    if(form.invalid){return}
    const passwordData ={
      password:form.value.password,
      passwordConfirm:form.value.passwordConfirm
    }

    this.authService.resetPassword(passwordData,this.token)
    .subscribe(
      ()=>{

        alert("You are now Logged In")
        this.router.navigate(["/"])
      }
    )

  }

}
