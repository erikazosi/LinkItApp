import {Component, Inject, OnInit,TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../providers/authentication/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';



@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  modalRef: BsModalRef;
  email: String;
  password: String;
  phone: String;
  fullName: String;
  db = firebase.database();
  loginForm: FormGroup;
  passwordResetEmail:String;

  constructor(public as: AuthService, public router: Router,private modalService: BsModalService) {

    var currentUser = firebase.auth().currentUser;
    if(firebase.auth().currentUser) {
      this.router.navigate(['dashboard']);
    }

    this.loginForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }


  ngOnInit() {
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
closeModal(){
this.modalRef.hide()}

  loginWithEmail(email, password) {
    this.as.loginWithEmail(email, password).then((res) => {
      // this.saveLocalStorage();
      this.router.navigate(['dashboard'])
    })
  }


  loginWithGmail() {
    this.as.loginWithGoogle().then((res) => {

      this.router.navigate(['dashboard']);
    });

  }

  loginWithFacebook() {
    this.as.loginWithFacebook().then((res) => {
      this.router.navigate(['dashboard']);

    })

  }

  forgetPassword(passwordResetEmail) {
    this.as.forgetPassword(passwordResetEmail);
    this.closeModal();
  }

}
