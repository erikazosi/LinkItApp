import {Inject, Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {User} from '../../model/user/user.model';
import {UserService} from '../../model/user/user.service';
import {AngularFireDatabase} from 'angularfire2/database-deprecated';
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
  userKey: String;
  userId: String;

  constructor(public afAuth: AngularFireAuth,
              @Inject(UserService) private userSvc: UserService,
              private db: AngularFireDatabase,
              private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService) {

    this.afAuth.authState
      .do(user => {
        firebase.database().ref('user').orderByChild('uid').equalTo(user.uid)
          .on('child_added', (function (snap) {
            this.userKey = snap.key;
            this.updateUserOnConnect();
            this.updateOnDisconnect();
          }).bind(this));
      }).subscribe();
  }

  saveToLocalStorage(key, val): void {
    this.storage.set(key, val);
    this.userData[key] = this.storage.get(key);
  }

  addUserToDb(email, password, role, firstName, lastName) {
    var currentUser = firebase.auth().currentUser;
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    this.user.role = role;
    this.user.uid = currentUser.uid;
    this.user.email = currentUser.email;
    this.user.photoUrl = currentUser.photoURL;
    this.user.phone = currentUser.phoneNumber;
    this.userSvc.persistUser(this.user);
    console.log('user persisted');

  }

  loginWithGoogle() {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res) => {
      // var token = result.credential.accessToken;
      // var user = result.user;
      var user = firebase.auth().currentUser;
      var data: Boolean = true;
      // https://codereview.stackexchange.com/questions/97696/function-to-split-full-name-into-first-last
      var userExist = this.userSvc.findUserByEmail(user.email).once('value', (function (snap) {
        data = snap.exists();

        if (!data) {
          var nameArr = user.displayName.split(/\s+/);

          var firstName = nameArr.slice(0, -1).join(' ');
          var lastName = nameArr.pop();
          this.addUserToDb('', '', 'client', firstName, lastName);

        }
      }).bind(this));


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

  /*
  //clear all user from firebase console

  var intervalId;

var clearFunction = function() {
  if ($('[aria-label="Delete account"]').size() == 0) {
    console.log("interval cleared")
    clearInterval(intervalId)
    return
  }
  $('[aria-label="Delete account"]')[0].click();
  setTimeout(function () {
     $(".md-raised:contains(Delete)").click()
  }, 1000);
};

intervalId = setInterval(clearFunction, 3000)
   */

  logout() {
    this.storage.remove('role');
    this.storage.remove('isLoggedIn');
    this.updateOnlineStatus('offline');

    return firebase.auth().signOut().then(function () {
      console.log('User Logged out');
    }).catch(function (error) {
      console.log(error);
    });

  }


  loginWithFacebook() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(function (result) {
      var user = firebase.auth().currentUser;
      var data: Boolean = true;
      // https://codereview.stackexchange.com/questions/97696/function-to-split-full-name-into-first-last
      var userExist = this.userSvc.findUserByEmail(user.email).once('value', (function (snap) {
        data = snap.exists();

        if (!data) {
          var nameArr = user.displayName.split(/\s+/);

          var firstName = nameArr.slice(0, -1).join(' ');
          var lastName = nameArr.pop();
          this.addUserToDb('', '', 'client', firstName, lastName);

        }
      }).bind(this));


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

  signup(email, password, client, firstName, lastName) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((res) => {
      if (client == 'client') {
        this.addUserToDb(email, password, client, firstName, lastName);
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


  private updateUserOnConnect() {
    return this.db.object('.info/connected')
      .do(connected => {
        if (connected) {
          this.updateOnlineStatus('online');

        }
        else
          this.updateOnlineStatus('offline');


      })
      .subscribe();

  }

  private updateOnDisconnect() {
    firebase.database().ref().child('user/' + this.userKey)
      .onDisconnect()
      .update({status: 'offline'});

  }


  private updateOnlineStatus(status: String) {
    if (!this.userKey) return
    this.db.object('user/' + this.userKey).update({status: status})

  }

}



