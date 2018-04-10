import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import * as firebase from 'firebase/app';
import {User} from '../../model/user/user.model';
import {UserService} from '../../model/user/user.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  modalRef: BsModalRef;
  isPro: Boolean;
  user: User = new User();
  currentUser = firebase.auth().currentUser;
  businessTime: any;


  scheduleTime = [];

  constructor(private userSvc: UserService, private modalService: BsModalService, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    this.isPro = false;
    var role = this.storage.get('role');
    if (role == 'pro') {
      this.isPro = true;
    }

    var currentUser = this.storage.get('firebase:authUser:AIzaSyA5H7eILXvGENn7Vf3sFnJTevTgRUen2lo:[DEFAULT]');


    this.userSvc.getCurrentUserInfo(currentUser.uid).on('child_added', (function (snap) {
      this.user.photoUrl = currentUser.photoURL;

      this.user.firstName = snap.val().firstName;
      this.user.lastName = snap.val().lastName;
      this.user.city = snap.val().city;
      this.user.phone = snap.val().phone;
      this.user.email = snap.val().email;
      // this.user.photoUrl = snap.val().photoUrl;
    }).bind(this));

    this.getBusinessTime(currentUser.uid);


  }

  updateProfile(){


  }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide()
  }

  private getBusinessTime(uid) {
    firebase.database().ref('schedule/').orderByValue().once('child_added', (function (res) {

      if (res.key == uid) {
        this.scheduleTime.push(res.val());
      }

    }).bind(this));

  }

  editBusinessTime(template: TemplateRef<any>) {
    this.openModal(template);
  }

  editUserInfo(temp: TemplateRef<any>) {
    this.openModal(temp);
  }
}
