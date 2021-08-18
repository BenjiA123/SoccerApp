import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private authListenerSubs: Subscription
   userIsAuthenticated = false

  constructor(private authService :AuthService, private router:Router) { }


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
