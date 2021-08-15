import { Component} from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
    myInfo
  constructor(private authService:AuthService) {
  }

  ngOnInit() {

   this.authService.getCurrentUserProfile().subscribe(res =>{
    this.myInfo = res.data
    console.log(this.myInfo)

   })

  }

}
