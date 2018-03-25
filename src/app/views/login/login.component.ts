import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../providers/authentication/auth.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {UserService} from '../../model/user/user.service';


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
  passwordResetEmail: String;
  currentUser = firebase.auth().currentUser;

  constructor(public as: AuthService, public router: Router, private modalService: BsModalService, private userSvc: UserService) {


    if (firebase.auth().currentUser) {
      this.router.navigate(['']);
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

  closeModal() {
    this.modalRef.hide()
  }

  loginWithEmail(email, password) {
    this.as.loginWithEmail(email, password).then((res) => {
      this.navigateThruRole(email);

    })


  }


  loginWithGmail() {
    this.as.loginWithGoogle().then((res) => {
      this.navigateThruRole(this.currentUser.email);
    });

  }

  loginWithFacebook() {
    this.as.loginWithFacebook().then((res) => {
      this.navigateThruRole(this.currentUser.email);

    })

  }

  forgetPassword(passwordResetEmail) {
    this.as.forgetPassword(passwordResetEmail);
    this.closeModal();
  }

  navigateThruRole(email){
    var checkRole = this.userSvc.checkUserRole(email);


    if (checkRole.toString() == 'client') {
      this.router.navigate(['dashboard']);

    }
    else if(checkRole.toString()=='admin'){
      this.router.navigate(['']);

    }
    else{
      this.router.navigate(['profile/dashboard'])

    }
  }

}
