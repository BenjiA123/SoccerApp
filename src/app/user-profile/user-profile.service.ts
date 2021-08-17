import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from "./../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  user:any

  constructor(private http:HttpClient) { }

  // On click of Link, get user and display on user page
  getUserByUsername(username){
  return  this.http.get(`${BACKEND_URL}/${username}`)
  }


}
