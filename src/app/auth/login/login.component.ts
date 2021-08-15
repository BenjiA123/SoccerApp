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
    this.authStatusSub = this.authService.getauthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false
      }
    )
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
  onLogin(form: NgForm) {
    this.isLoading = true
    if (form.invalid) {
      this.isLoading = false
      return
    }
    // For now you cant log in with username 
    this.authService.login(form.value.email, form.value.password, null,null)
  }

}