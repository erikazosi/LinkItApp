import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as firebase from 'firebase/app';
import {UserService} from '../../model/user/user.service';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pending-projects',
  templateUrl: './pending-projects.component.html',
  styleUrls: ['./pending-projects.component.css']
})
export class PendingProjectsComponent implements OnInit {
  modalRef: BsModalRef;
  newProjects: Number;
  fullName: String;
  email: String;
  allProject = [];
  currentUser = firebase.auth().currentUser;

  constructor(private userSvc: UserService, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.getAllProjects();

  }

  getAllProjects() {
    firebase.database().ref('projects/').orderByChild('appointmentFor').equalTo(this.currentUser.uid).on('child_added', (function (snap) {
      if (snap.val().status != 'deleted' && snap.val().status == 'pending')
        this.allProject.push({'appointmentId': snap.key, ...snap.val()});

    }).bind(this));

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
    var ref = firebase.database().ref('projects/');
    ref.orderByChild('appointmentFor')
      .equalTo(this.currentUser.uid).on('child_added', (function (snap) {
      if (snap.key == appointmentId) {
        var data = snap.val();
        ref.child(snap.key).update({
          'status': 'accepted'
        });
      }


    }).bind(this));
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

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide()
  }


}
