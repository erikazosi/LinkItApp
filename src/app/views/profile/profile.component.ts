import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app'
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

      name:String;
      location:String;
      phone:String;
      email:String;
      photoUrl:String;
  id: String;

  sub: any;
  constructor(private route: ActivatedRoute) {
    var user=firebase.auth().currentUser;
    this.name = user.displayName;
    this.phone = user.phoneNumber;
    this.location = user.email;
    this.photoUrl = user.photoURL;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    })
  }

}
