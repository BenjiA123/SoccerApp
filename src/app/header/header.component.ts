import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private authListenerSubs: Subscription
   userIsAuthenticated = false

  constructor(private authService :AuthService, private router:Router) { }

// Create a subject such that when you click,it unchecks
// Use local
  isChecked:boolean;

  unCheckFunction(checkbox:any){

    this.isChecked = checkbox.checked
    console.log(this.isChecked)
    if(this.isChecked){ this.isChecked = !this.isChecked}
    else{this.isChecked = true}
  }

  changeCheckedState(){
    this.isChecked =!this.isChecked

  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService.getauthStatusListener().subscribe(
      (isAuthenticated)=>{
        this.userIsAuthenticated = isAuthenticated

      }
    )
  }
  onLogout(){
    this.authService.logout()
  }
  ngOnDestroy(){
    this.authListenerSubs.unsubscribe()
  }

  goBack(){
        this.router.navigate(['/'])
  }

}
