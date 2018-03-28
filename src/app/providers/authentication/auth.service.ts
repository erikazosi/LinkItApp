import {Inject, Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {User} from '../../model/user/user.model';
import {UserService} from '../../model/user/user.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {Router} from '@angular/router';

import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

// Import Observable


@Injectable()
export class AuthService {
  warning: false;
  errorMessage: String;
  currentUser = firebase.auth().currentUser;
  user: User = new User();
  public userData: any = [];
  found: String;
  userInfo: {
    email: String,
    password: String,
    repPassword: String,
    phone: String,
    dob: Date,
    street: String,
    city: String,
    zipCode: Number,
    country: String,
    category: String,
    role: String
  };

  constructor(public afAuth: AngularFireAuth,
              @Inject(UserService) private userSvc: UserService,
              private db: AngularFireDatabase,
              private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
  }

  saveToLocalStorage(key, val): void {
    this.storage.set(key, val);
    this.userData[key] = this.storage.get(key);
  }

  addUserToDb(email, password, role,firstName,lastName) {
    var currentUser = firebase.auth().currentUser;
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    this.user.role = role;
    this.user.uid = currentUser.uid;
    this.user.email = currentUser.email;
    this.user.photoUrl = currentUser.photoURL;
    this.user.phone=currentUser.phoneNumber;
    this.userSvc.persistUser(this.user);
    console.log('user persisted');

  }

  loginWithGoogle() {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res) => {
      // var token = result.credential.accessToken;
      // var user = result.user;
        var user=firebase.auth().currentUser;
      // https://codereview.stackexchange.com/questions/97696/function-to-split-full-name-into-first-last
       var userExist=this.userSvc.findUserByEmail(user.email);
      console.log('userExist==>' + userExist.val().email);
      if (userExist.val().email=='') {
        var nameArr = this.currentUser.displayName.split(/\s+/);

        var firstName = nameArr.slice(0, -1).join(' ');
        var lastName = nameArr.pop();
        this.addUserToDb('', '', 'client',firstName,lastName);

      }

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
    this.storage.remove('role');
    return firebase.auth().signOut().then(function () {
      console.log('User Logged out');
    }).catch(function (error) {
      console.log(error);
    });

  }


  loginWithFacebook() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(function (result) {
      var user=firebase.auth().currentUser;

      var found= this.userSvc.findUserByEmail(user.email);

      if (found.toString()) {
        console.log(found.toString());
      }else{
        var nameArr = this.currentUser.displayName.split(/\s+/);

        var firstName = nameArr.slice(0, -1).join(' ');
        var lastName = nameArr.pop();
        this.addUserToDb('', '', 'client',firstName,lastName);
      }
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

  signup(email, password, client,firstName,lastName) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((res) => {
      if (client == 'client') {
        this.addUserToDb(email, password, client,firstName,lastName);
      }
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



