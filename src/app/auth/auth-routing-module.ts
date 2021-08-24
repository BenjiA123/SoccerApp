import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const authRoutes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    { path: "forgot-password", component: ForgotPasswordComponent },
]

@NgModule({
    imports: [
        RouterModule.forChild(authRoutes)
    ],
    exports: [
        RouterModule
    ]
})


export class AuthRoutingModule { }