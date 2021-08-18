import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "./../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http :HttpClient) { }

  updateMe(newInfo:any){
  return  this.http.patch(`${BACKEND_URL}/me`,newInfo)

  }
  deactivateMe(){
    return this.http.delete(`${BACKEND_URL}/me`)
  }

}
