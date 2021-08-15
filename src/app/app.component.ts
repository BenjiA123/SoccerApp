import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
lottie;
constructor(private authService:AuthService){
  this.lottie = { path: 'assets/scatter.json',
  renderer: 'canvas',
  autoplay: true,
  loop: true
};
}

ngOnInit(){
  this.authService.autoAuthUser()
}

}
