import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing-module';
import { LottieAnimationViewModule } from 'ng-lottie';



@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        RouterModule,
        FormsModule,LottieAnimationViewModule.forRoot(),
        AuthRoutingModule

    ]
})
export class AuthModule { }