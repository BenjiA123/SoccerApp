import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true
  isLoading = false
  lottie
  private loadingSub:Subscription
  private authStatusSub: Subscription
  lottieSpinner: { path: string; renderer: string; autoplay: boolean; loop: boolean; };
  constructor(public authService: AuthService) {
    this.lottieSpinner = {
      path: '././assets/trail-loading.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
    this.lottie = {
      path: '././assets/bounce.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  ngOnInit() {
    this.loadingSub = this.authService.getLoadingState().subscribe(
      loadingState =>{
        this.isLoading = loadingState
      }
    )
    this.authStatusSub = this.authService.getauthStatusListener().subscribe(
      authStatus => {
        if(authStatus) this.isLoading = false
 
      }
    )
  }
  ngOnDestroy() {
    // Subscription give you a place to store your subscription so you can unsubscribe to revent lose data
    this.authStatusSub.unsubscribe()
    this.loadingSub.unsubscribe()

  }
  onLogin(form: NgForm) {
    this.isLoading = true
    if (form.invalid) {
      this.isLoading = false
      return
    }
    // For now you cant log in with username 
    this.authService.login(form.value.email, form.value.password, null,null,null,null)
  }

}
