import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import * as firebase from 'firebase/app';
import {UserService} from '../../model/user/user.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Time} from '@angular/common';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']

})


export class ProjectsComponent implements OnInit {
  modalRef: BsModalRef;
  fullName: String;
  email: String;
  appointmentTime: Time;
  allProject = [];
  noTime: Boolean = false;
  currentUser = firebase.auth().currentUser;
  p: number = 1;
  filter: any;
  key: string = 'name'; //set default
  reverse: boolean = false;

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  constructor(private userSvc: UserService, private modalService: BsModalService, private chRef: ChangeDetectorRef) {

    this.changeNewProjectStatus();
  }

  ngOnInit() {

    this.getAllProjects();

  }


  getAllProjects() {
    // <script>

    firebase.database().ref('projects/').orderByChild('appointmentFor').equalTo(this.currentUser.uid).on('child_added', (function (snap) {
      if (snap.val().status != 'deleted')
        this.allProject.push({'appointmentId': snap.key, ...snap.val()});

    }).bind(this));


  }

  changeNewProjectStatus() {

    var ref = firebase.database().ref('projects/');
    ref.orderByChild('appointmentFor')
      .equalTo(this.currentUser.uid).on('child_added', (function (snap) {
      var data = snap.val();

      if (data.notificationStatus == 'new') {

        ref.child(snap.key).update({
          'notificationStatus': 'checked'
        });
      }
    }).bind(this));

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide()
  }

  showProjectDetail(template: TemplateRef<any>, appointmentBy) {
    this.openModal(template);

    var ref = this.userSvc.getCurrentUserInfo(appointmentBy);
    ref.on('child_added', (function (res) {

      this.fullName = res.val().firstName + ' ' + res.val().lastName;
      this.email = res.val().email;
    }).bind(this));
  }

  acceptProject(appointmentId) {
    if (this.appointmentTime) {
      var ref = firebase.database().ref('projects/');
      ref.orderByChild('appointmentFor')
        .equalTo(this.currentUser.uid).on('child_added', (function (snap) {
        if (snap.key == appointmentId) {
          var data = snap.val();
          ref.child(snap.key).update({
            'status': 'accepted',
            'appointmentTime': this.appointmentTime,
            'latest': 'Y'

          });
        }


      }).bind(this));
      this.closeModal();
    }
    else {
      this.noTime = true;

    }

  }

  deleteProject(appointmentId) {
    var ref = firebase.database().ref('projects/');
    ref.orderByChild('appointmentFor')
      .equalTo(this.currentUser.uid).on('child_added', (function (snap) {
      if (snap.key == appointmentId) {

        var data = snap.val();
        ref.child(snap.key).update({
          'status': 'deleted'
        });
      }
    }).bind(this));
    this.closeModal();
  }
}

