import {Component, Inject, OnInit} from '@angular/core';
import * as firebase from 'firebase/app';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AngularFireDatabase} from 'angularfire2/database-deprecated';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {
  currentUser = firebase.auth().currentUser;
  modalRef: BsModalRef;
  newProjects: Number;
  fullName: String;
  email: String;
  allProject = [];

  projects = new BehaviorSubject([]);
  batch = 5;
  lastKey = '';
  finished = false;
  current: any;

  constructor(private db: AngularFireDatabase, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
  }

  ngOnInit() {
    this.current = this.storage.get('firebase:authUser:AIzaSyA5H7eILXvGENn7Vf3sFnJTevTgRUen2lo:[DEFAULT]');

    this.changeProjectStatus();
    this.getAllProjects();
  }

  getAllProjects() {


    firebase.database().ref('projects/').orderByChild('appointmentBy').equalTo(this.current.uid).on('child_added', (function (snap) {


      if (snap.val().status != 'deleted') {
        this.allProject.push({'appointmentId': snap.key, ...snap.val()});

      }
    }).bind(this));
  }


  private changeProjectStatus() {

    var ref = firebase.database().ref('projects/');
    ref.orderByChild('appointmentBy')
      .equalTo(this.current.uid).on('child_added', (function (snap) {
      var data = snap.val();

      if (data.latest == 'Y') {

        ref.child(snap.key).update({
          'latest': 'N'
        });
      }
    }).bind(this));
  }
}
