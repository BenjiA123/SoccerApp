import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './signup/auth-data.model';
import { environment } from './../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/users'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false
  private authStatusListener = new Subject<boolean>()
  private tokenTimer: any
  private userId: string
  constructor(private http: HttpClient, private router: Router) { }


  getCurrentUserProfile(){
  return this.http.get<{data:any}>(BACKEND_URL + '/me')
  }

  createUser(email: string, password: string,clubName:string,username:string) {
    const authData: AuthData = {
      email: email,
      password: password,
      clubName,
      username
    }
    this.http.post(BACKEND_URL + '/signup', authData)
      .subscribe(result => {
        this.login(email,password,clubName,username)
        this.router.navigate(["/"])
      },
        error => {
          this.authStatusListener.next(false)
        }

      )
  }

  getauthStatusListener() {
    return this.authStatusListener.asObservable()
  }


  login(email: string, password: string,clubName:string,username:string) {
    const authData: AuthData = {
      email: email,
      password: password,
      clubName,
      username
    }
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
      .subscribe((result:any) => {
        const token = result.token
        this.token = token
        if (token) {
          const expiresInDuration = result.expiresIn
          this.isAuthenticated = true
          this.userId = result.user._id
          this.authStatusListener.next(true)

          
          const currentDate = new Date();
          const expirationDate = new Date(currentDate.getTime() + expiresInDuration*1000);
          this.saveAuthData(token,expirationDate,null)

          this.router.navigate(["/"])
        }

      },
        error => {
          this.authStatusListener.next(false)
        }
      )
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      // this.logout()
    }, duration)
  }
  getIsAuth() {
    return this.isAuthenticated
  }
  getToken() {
    return this.token
  }
  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expiration')
  }
  logout() {
    this.token = null
    this.isAuthenticated = false
    this.userId = null
    this.authStatusListener.next(false)
    clearTimeout(this.tokenTimer);
    this.clearAuthData()
    this.router.navigate(["/"])
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)

  }
  autoAuthUser() {
    const authInformation = this.getAuthData()
    if (!authInformation) {
      return
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
    if (expiresIn > 0) {
      this.token = authInformation.token
      this.isAuthenticated = true
      this.userId = authInformation.userId
      this.setAuthTimer(expiresIn)
      this.authStatusListener.next(true)
    }
  }
  private getAuthData() {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const expirationDate = localStorage.getItem('expiration')
    if (!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
      , userId: userId
    }
  }
  getUserId() {
    return this.userId
  }
}
