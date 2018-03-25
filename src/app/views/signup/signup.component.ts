import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../providers/authentication/auth.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {User} from '../../model/user/user.model';
import {UserService} from '../../model/user/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [UserService]
})
export class SignupComponent implements OnInit {
  firstName: String;
  lastName: String;
  currentUser = firebase.auth().currentUser;


  user: User = new User();

  ngOnInit(): void {
  }

  email: String;
  password: String;
  repPassword: String;

  warning = false;
  errorMessage: String;


  constructor(public as: AuthService, public router: Router) {
    //check whether user is logged in
    var currentUser = firebase.auth().currentUser;
    if (firebase.auth().currentUser) {
      this.router.navigate(['']);
    }

  }


  signupWithEmail(email, password, repPassword) {
    if (password === repPassword) {
      this.as.signup(email, password,'client');
    }
  }


  signUpWithGmail() {
    this.as.loginWithGoogle().then((res) => {
      this.router.navigate(['']);
    })
  }

  signUpWithFacebook() {
    this.as.loginWithFacebook().then((res) => {
      this.router.navigate(['']);
    })
  }
}



