import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-setting-detail-page',
  templateUrl: './setting-detail-page.component.html',
  styleUrls: ['./setting-detail-page.component.css']
})
export class SettingDetailPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    private authService:AuthService, 
    private settingsService:SettingsService) { }

  currentRoute
  currentUserData:any
  ngOnInit() {
    this.route.params
    .subscribe(
      (params:Params)=>{
        this.currentRoute = params['detail']
        console.log(this.currentRoute)
      }
    )
    this.authService.getCurrentUserProfile()
    .subscribe(
      (currentUser:any)=>{
        this.currentUserData = currentUser.data
      }
    )
    // Current route can either be delete account or the rest.

  }

  updatePassword(passwordForm:NgForm){

    if (passwordForm.invalid) {
      return
    }
    const passwordData :any = {

      currentPassword:passwordForm.value.currentPassword,
         password:passwordForm.value.password,
         passwordConfirm:passwordForm.value.passwordConfirm,

    }

    this.settingsService.updateMyPassword(passwordData).subscribe(
      ()=>{
        console.log("Updated Successfully")
        
      }
    )

  }


  onUpdateUser(form: NgForm) {
    if (form.invalid) {
        return
      }
      const updatedData :any = {

        username:form.value.username,
           name:form.value.name,
           email:form.value.email,
           clubName:form.value.clubName,
           description:form.value.description,

      }

      this.settingsService.updateMe(updatedData)
      .subscribe((updatedResult)=>{
        console.log(updatedResult)
      })
    // For now you cant log in with username 
    // this.authService.login(form.value.email, form.value.password, null,null,null,null)
  }


  onDeleteAccount(){
    
    this.settingsService.deactivateMe()
    .subscribe(
      (res)=>{
        this.authService.logout()
      }
    )
  }

}
