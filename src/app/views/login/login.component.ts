import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../providers/authentication/auth.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {UserService} from '../../model/user/user.service';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';


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

  constructor(public as: AuthService,
              public router: Router,
              private modalService: BsModalService,
              private userSvc: UserService,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService) {


    if (firebase.auth().currentUser) {
      this.router.navigate(['']);
    }

    this.loginForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }

  saveToLocalStorage(key, val): void {
    this.storage.set(key, val);
    this.storage.get(key);
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
      var user = firebase.auth().currentUser;
      this.navigateThruRole(user.email);
    });

  }

  loginWithFacebook() {
    this.as.loginWithFacebook().then((res) => {
      var user = firebase.auth().currentUser;

      this.navigateThruRole(user.email);

    })

  }

  forgetPassword(passwordResetEmail) {
    this.as.forgetPassword(passwordResetEmail);
    this.closeModal();
  }

  navigateThruRole(email) {
    var ref = this.userSvc.checkUserRole(email);
    ref.on('child_added', (function (snap) {
      var role = snap.val().role;
      console.log(role);
      if (role == 'client') {
        this.storage.set('role', 'client');
        this.storage.set('isLoggedIn', 'true');
        this.router.navigate(['']);

      }
      else if (role == 'admin') {
        this.storage.set('role', 'client');
        this.storage.set('isLoggedIn', 'true');
        this.router.navigate(['']);

      }
      else {
        this.saveToLocalStorage('role', 'pro');
        this.storage.set('isLoggedIn', 'true');
        this.router.navigate([''])

      }
    }).bind(this));

  }

}
