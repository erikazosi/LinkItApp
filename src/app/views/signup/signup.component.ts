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


  user: User = new User();

  ngOnInit(): void {
  }

  email: String;
  password: String;
  repPassword: String;

  warning = false;
  errorMessage: String;


  constructor(public as: AuthService, public router: Router, private userSvc: UserService) {
    //check whether user is logged in
    var currentUser = firebase.auth().currentUser;
    if (firebase.auth().currentUser) {
      this.router.navigate(['dashboard']);
    }

  }


  signupWithEmail(email, password, repPassword, firstName, lastName) {
    if (password === repPassword) {
      this.as.signup(email, password).then((result) => {

      })
        .catch(function (error) {
          // Handle Errors here.
          console.log(error);
          var errorCode = error.code;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });


    }
  }

  addUserToDb(firstName, lastName) {
    console.log('here');
    var currentUser = firebase.auth().currentUser;
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    this.user.role = 'client';
    this.user.uid = currentUser.uid;


    this.userSvc.persistUser(this.user);
  }



  signUpWithGmail() {
    this.as.loginWithGoogle().then((res)=>{
        this.router.navigate(['dashboard']);
      var user = firebase.auth().currentUser;

        this.addUserToDb(user.displayName, user.displayName);


    })
  }

  signUpWithFacebook() {
    this.as.loginWithFacebook().then((res)=>{
      this.router.navigate(['dashboard']);
      var user = firebase.auth().currentUser;

      this.addUserToDb(user.displayName, user.displayName);


    })
  }
}



