import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { VerifyEmailComponent } from './signup/verify-email/verify-email.component';

const authRoutes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    { path: "forgot-password", component: ForgotPasswordComponent },
    { path: "reset-password/:token", component: ResetPasswordComponent },
    { path: "verify-email/:verifyToken", component: VerifyEmailComponent },
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