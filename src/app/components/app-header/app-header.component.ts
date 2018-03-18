import {Component} from '@angular/core';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {AuthService} from '../../providers/authentication/auth.service';
// import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {
  isLoggedIn:Boolean;
  constructor(public as: AuthService, public router: Router) {
    this.isLoggedIn = false;
    var currentUser = firebase.auth().currentUser;
    if(currentUser) {
      this.isLoggedIn = true;
    }
  }

  logout() {
    this.as.logout();
    this.router.navigate(['/login']);
    }

  //
  //
  // saveLocalStorage(){
  //   // console.log('recieved= key:' + key + 'value:' + val);
  //   // this.storage.set(key, val);
  //   this.storage.set("isLoggedIn","true");
  //
  //   }
}
