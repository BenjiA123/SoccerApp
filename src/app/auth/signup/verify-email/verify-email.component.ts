import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private authService:AuthService,private route:ActivatedRoute, private router: Router) { }

  token:string
  ngOnInit() {
    this.route.params
    .subscribe(
      (params:Params)=>{
        this.token = params['verifyToken']
      }
    )
  }

  verifyEmail(){
    this.authService.verifyEmail(this.token)
    .subscribe(
      ()=>{
        alert("You have been verified And Logged In😊😊")
        this.router.navigate(["/"])

      }
    )
  }


}
