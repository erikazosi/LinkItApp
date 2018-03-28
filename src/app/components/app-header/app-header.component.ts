import {Component, Inject} from '@angular/core';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {AuthService} from '../../providers/authentication/auth.service';
import {UserService} from '../../model/user/user.service';

import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {
  isSetup: Boolean;
  isLoggedIn: Boolean;
  role:String;
isPro: Boolean;
isClient:Boolean;
isAdmin:Boolean;
  photoUrl: String;
  constructor(public as: AuthService, public router: Router, private userSevice: UserService,  @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    this.isSetup = this.userSevice.isSetup;

    this.isLoggedIn = false;
    this.isPro=false;
    this.isClient = false;
    this.isAdmin = false;
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      this.isLoggedIn = true;
      this.photoUrl = currentUser.photoURL;
    }

    this.role=this.storage.get("role");
    if(this.role=="pro")
    {
      this.isPro=true;
    }
    else if(this.role=="client")
    {
      this.isClient = true;
    }else{
      this.isAdmin = true;
    }

  }

  logout() {
    this.as.logout();
    this.router.navigate(['/login']);
  }

}
