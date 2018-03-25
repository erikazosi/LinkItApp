import {Inject, Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {User} from '../../model/user/user.model';
import {UserService} from '../../model/user/user.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {Router} from '@angular/router';

// Import Observable


@Injectable()
export class AuthService {
  warning: false;
  errorMessage: String;
  currentUser = firebase.auth().currentUser;
  user: User = new User();

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

  constructor(public afAuth: AngularFireAuth,@Inject(UserService) private userSvc: UserService,private db: AngularFireDatabase,private router:Router) {
  }

  addUserToDb(firstName, lastName,role) {
    console.log('here');
    var currentUser = firebase.auth().currentUser;
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    this.user.role = role;
    this.user.uid = currentUser.uid;
    this.user.email = currentUser.email;
    this.userSvc.persistUser(this.user);
  }

  loginWithGoogle() {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res)=> {
      // var token = result.credential.accessToken;
      // var user = result.user;

      // https://codereview.stackexchange.com/questions/97696/function-to-split-full-name-into-first-last

   var found=this.userSvc.findUserByEmail(this.currentUser.email);

      if(found ==null)
      {
        var nameArr = this.currentUser.displayName.split(/\s+/);

        var firstName = nameArr.slice(0, -1).join(' ');
        var lastName = nameArr.pop();
        this.addUserToDb(firstName, lastName,'client');
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

    return firebase.auth().signOut().then(function () {
      console.log('User Logged out');
    }).catch(function (error) {
      console.log(error);
    });

  }


  loginWithFacebook() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(function (result) {
      var found=this.userSvc.findUserByEmail(this.currentUser.email);

      if(found ==null)
      {
        var nameArr = this.currentUser.displayName.split(/\s+/);

        var firstName = nameArr.slice(0, -1).join(' ');
        var lastName = nameArr.pop();
        this.addUserToDb(firstName, lastName,'client');
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

  signup(email, password,client) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((res) => {
      if(client=='client'){
      this.addUserToDb(email, password,client);
      }
      else{
        this.loginWithEmail(email, password).then((res)=> {
          this.router.navigate(['dashboard']);
          var currentUser = firebase.auth().currentUser;
          this.addProToDb(currentUser);

        })
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

  addProToDb(currentUser) {
    const uList = this.db.list('user');

    uList.push({
        'firstName': this.user.firstName,
        'lastName': this.user.lastName,
        'email': this.user.email,
        'phone': this.user.phone,
        'dob': this.user.dob,
        'street': this.user.street,
        'city': this.user.city,
        'zipCode': this.user.zipCode,
        'country': this.user.country,
        'category': this.user.category,
        'role': 'pro',
        'uid': currentUser.uid

      }
    );

  }


  forgetPassword(email) {
    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error))
  }


}



