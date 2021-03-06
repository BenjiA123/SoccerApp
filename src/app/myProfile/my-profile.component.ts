import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MyProfileService } from './my-profile.service';



@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
    myInfo
  constructor(private authService:AuthService, private myProfileService:MyProfileService) {
  }
posts
  ngOnInit() {
// Complete later

   this.authService.getCurrentUserProfile().subscribe(res =>{
    this.myInfo = res.data

    this.myProfileService.postsByCurrentUser(this.myInfo._id)
    .subscribe(
      (posts:any)=>{
        this.posts = posts.data
      }
    )
   })

   


  }

}
