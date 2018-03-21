import {Inject, Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {User} from '../../model/user/user.model';
import {UserService} from '../../model/user/user.service';

// Import Observable


@Injectable()
export class AuthService {
  warning: false;
  errorMessage: String;
  currentUser = firebase.auth().currentUser;
  user: User = new User();

  constructor(public afAuth: AngularFireAuth,@Inject(UserService) private userSvc: UserService) {
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

  loginWithGoogle() {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function (result) {
      // var token = result.credential.accessToken;
      // var user = result.user;

      // https://codereview.stackexchange.com/questions/97696/function-to-split-full-name-into-first-last

      this.userSvc.findUserByEmail(this.currentUser.email);

      var nameArr = this.currentUser.displayName.split(/\s+/);

      var firstName = nameArr.slice(0, -1).join(' ');
      var lastName = nameArr.pop();
      this.addUserToDb(firstName, lastName);
    })
      .catch(function (error) {

        // Handle Errors here.
        var errorCode = error.code;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });

  }

  logout() {

    return firebase.auth().signOut().then(function () {
      console.log('User Logged out');
    }).catch(function (error) {
      console.log(error);
    });

  }


  loginWithFacebook() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(function (result) {
      // var token = result.credential.accessToken;
      // var user = result.user;
      // console.log(token);
      // console.log(user);
      var nameArr = this.currentUser.displayName.split(/\s+/);

      var firstName = nameArr.slice(0, -1).join(' ');
      var lastName = nameArr.pop();
      this.addUserToDb(firstName, lastName);

    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  loginWithEmail(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function (result) {

    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  signup(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((res) => {
      this.addUserToDb(email, password);
      // res.sendEmailVerification();
      alert('Account created');
    }).catch(function (error) {
      alert('Password Doesnt match');
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

  forgetPassword(email) {
    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error))
  }
}



