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
  role: String;
  isPro: Boolean;
  isClient: Boolean;
  isAdmin: Boolean;
  photoUrl: String;
  loginStatus: String;
  newProjects: Number;
  count = 0;
  countMsg = 0;
  newMsg: Number;
  currentUser: any;
  newAcceptedProject: any;

  constructor(public as: AuthService, public router: Router, private userSevice: UserService, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    this.currentUser = this.storage.get('firebase:authUser:AIzaSyA5H7eILXvGENn7Vf3sFnJTevTgRUen2lo:[DEFAULT]');

    this.isSetup = this.userSevice.isSetup;
    this.isPro = false;
    this.isClient = false;
    this.isAdmin = false;

    this.loginStatus = this.storage.get('isLoggedIn');
    if (this.loginStatus == 'true') {
      this.isLoggedIn = true
    }
    if (this.currentUser) {
      this.photoUrl = this.currentUser.photoURL;
    }

    this.role = this.storage.get('role');
    if (this.role == 'pro') {
      this.countNewProjects();
      this.countNewMessage();


      this.isPro = true;
    }
    else if (this.role == 'client') {
      this.countAcceptedProject();
      this.countNewMessage();

      this.isClient = true;
    }

  }

  ngOnInit() {
  }

  logout() {
    this.as.logout();
    this.router.navigate(['/login']);
  }

  countNewProjects() {
    var current = this.storage.get('firebase:authUser:AIzaSyA5H7eILXvGENn7Vf3sFnJTevTgRUen2lo:[DEFAULT]');
    firebase.database().ref('projects/').orderByChild('appointmentFor')
      .equalTo(current.uid).on('child_added', (function (snap) {
      var data = snap.val();

      if (data.notificationStatus == 'new') {

        this.count++;

      }
      this.newProjects = this.count;

    }).bind(this));
  }

  countNewMessage() {
    var ref = this.userSevice.getCurrentUserInfo(this.currentUser.uid);
    ref.once('child_added').then((snap) => {
      firebase.database().ref('messages/').orderByChild('receiver')
        .equalTo(snap.key).on('child_added', (function (val) {
        var data = val.val();

        if (data.status == 'unread') {

          this.countMsg++;

        }
        this.newMsg = this.countMsg;

      }).bind(this));
    })

  }

  private countAcceptedProject() {
    var current = this.storage.get('firebase:authUser:AIzaSyA5H7eILXvGENn7Vf3sFnJTevTgRUen2lo:[DEFAULT]');
    firebase.database().ref('projects/').orderByChild('appointmentBy')
      .equalTo(current.uid).on('child_added', (function (snap) {
      var data = snap.val();

      if (data.latest == 'Y') {

        this.count++;

      }
      this.newAcceptedProject = this.count;

    }).bind(this));
  }
}
