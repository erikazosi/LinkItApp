import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Import Observable


@Injectable()
export class AuthService {
  warning: false;
  errorMessage: String;

  constructor(public afAuth: AngularFireAuth) {
  }


  loginWithGoogle() {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function (result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(token);
      console.log(user);
    })
    //   .catch(function(error) {
    //
    //     // Handle Errors here.
    //   var errorCode = error.code;
    //    this.errorMessage = error.message;
    //    // The email of the user's account used.
    //   var email = error.email;
    //    // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   // ...
    // });

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
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(token);
      console.log(user);

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
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(token);
      console.log(user);
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
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((res)=> {
     res.sendEmailVerification();
      alert('Account created');
    });

  }
  forgetPassword(email) {
    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error))
  }
}



