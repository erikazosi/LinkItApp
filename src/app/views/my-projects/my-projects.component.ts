import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase/app';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AngularFireDatabase} from 'angularfire2/database-deprecated';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

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

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
  }

  getAllProjects() {


    firebase.database().ref('projects/').orderByChild('appointmentBy').equalTo(this.currentUser.uid).on('child_added', (function (snap) {


      if (snap.val().status != 'deleted') {
        this.allProject.push({'appointmentId': snap.key, ...snap.val()});

      }
    }).bind(this));
  }


}
