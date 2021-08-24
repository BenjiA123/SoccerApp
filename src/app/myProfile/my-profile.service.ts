import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiUrl + "/posts";


@Injectable({
  providedIn: 'root'
})
export class MyProfileService {

  constructor(private http: HttpClient) {}


  postsByCurrentUser(id:string){

   return this.http.get(`${BACKEND_URL}/one-users-posts/${id}`)

  }
}
