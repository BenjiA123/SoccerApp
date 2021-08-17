import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private userProfileService:UserProfileService,
    private route: ActivatedRoute
  ) { }
user:any
username:string;
  ngOnInit() {
    this.username = this.route.snapshot.params['username']
        this.route.params
    .subscribe(
      (params:Params)=>{
        this.username = params['username']
      }
    )
    this.userProfileService.getUserByUsername(this.username).subscribe(
      (user:any)=>{
        this.user = user.data[0]
      }
    )

  }

}
