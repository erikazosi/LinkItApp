import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../providers/authentication/auth.service';

// import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';


@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  phone: String;
  fullName: String;
  db = firebase.database();
  loginForm: FormGroup;

  constructor(public as: AuthService, public router: Router) {
    // if(firebase.auth().currentUser) {
    //   this.router.navigate['dashboard'];
    //   console.log('check')
    // }
    this.loginForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }


  ngOnInit() {
  }


  loginWithEmail(email, password) {
    this.as.loginWithEmail(email, password).then((res) => {
      // this.saveLocalStorage();
      this.router.navigate(['dashboard'])
    })
  }


  loginWithGmail() {
    this.as.loginWithGoogle().then((res) => {

      this.router.navigate(['dashboard']);
    });

  }

  loginWithFacebook() {
    this.as.loginWithFacebook().then((res) => {
      this.router.navigate(['dashboard']);

    })

  }


  //
  //
  // saveLocalStorage(){
  //   // console.log('recieved= key:' + key + 'value:' + val);
  //   // this.storage.set(key, val);
  //   this.storage.set("isLoggedIn","true");
  //
  //   }


  forgetPassword(email) {
    this.as.forgetPassword(email);
  }
}
