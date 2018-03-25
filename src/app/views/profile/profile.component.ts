import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileInfo;
  constructor() { }

  ngOnInit() {
    this.profileInfo = new FormGroup({
      legalName: new FormControl("", Validators.required),
      dob: new FormControl("",Validators.required),
      street: new FormControl("",Validators.required),
      city: new FormControl("",Validators.required),
      zip: new FormControl("",Validators.required),
      country: new FormControl("",Validators.required),

    });
  }



  onClickSubmit(data){

  }


}
