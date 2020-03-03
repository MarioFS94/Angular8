import { Injectable, NgZone } from '@angular/core';
import * as _ from "lodash";
import { GoogleAuthService } from 'ng-gapi/lib/GoogleAuthService';
import GoogleUser = gapi.auth2.GoogleUser;
import { debug } from 'util';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public static readonly SESSION_STORAGE_KEY: string = "usuarioGoogle";

  profile: any = undefined;
  tokenUser: string;
  userId: string;
	
  constructor(private googleAuthService: GoogleAuthService, private ngZone: NgZone) { 
    if(this.isUserSignedIn()){
      this.setUser(this.getSessionUser());
    }
  }
  
  private setUser(user: any){
    this.profile = user['Rt'];
    this.tokenUser = user['uc'].access_token;
    this.userId = this.profile['eV'];
  }	  

  private getSessionUser(): GoogleUser {
    let user: string = sessionStorage.getItem(LoginService.SESSION_STORAGE_KEY);
    if (!user) {
      throw new Error("no token set , authentication required");
    }
    return JSON.parse(user);
  }

  public signIn() {
    this.googleAuthService.getAuth().subscribe((auth) => {
      auth.signIn().then(
        res => this.signInSuccessHandler(res),
        err => this.signInErrorHandler(err));
    });
  }

  public signOut(): void {
    this.googleAuthService.getAuth().subscribe((auth) => {
      try {
        auth.signOut();
        this.profile = undefined;
        this.tokenUser = undefined;
        this.userId = undefined;
      } catch (e) {
        console.error(e);
      }
      sessionStorage.removeItem(LoginService.SESSION_STORAGE_KEY);
    });
  }

  public isUserSignedIn(): boolean {
    return !_.isEmpty(sessionStorage.getItem(LoginService.SESSION_STORAGE_KEY));
  }

  private signInSuccessHandler(res: GoogleUser) {
   
    this.ngZone.run(() => {
      this.setUser(res);
      sessionStorage.setItem(
        LoginService.SESSION_STORAGE_KEY, JSON.stringify(res)
      );
    });
  }

  private signInErrorHandler(err) {
    console.warn(err);
  }
}  
