import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  lottie;
  hide = true;
  private authStatusSub: Subscription
  lottieSpinner: { path: string; renderer: string; autoplay: boolean; loop: boolean; };
  constructor(public authService: AuthService, private router: Router) {
    this.lottieSpinner = {
      path: '././assets/trail-loading.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
    this.lottie = {
      path: '././assets/chair-dude.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }
  isLoading = false
  form: AuthData
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
  onSignup(form: NgForm) {
    this.isLoading = true
    if (form.invalid) {
      this.isLoading = false
      return
    }
    this.authService.createUser(form.value.email, form.value.password,form.value.clubName,form.value.username)

    // 
  }

}
