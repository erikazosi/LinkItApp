import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../providers/authentication/auth.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {User} from '../../model/user/user.model';
import {UserService} from '../../model/user/user.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [UserService]
})
export class SignupComponent implements OnInit {
  firstName: String;
  lastName: String;
  currentUser = firebase.auth().currentUser;
  signupForm: FormGroup;
  email: String = '';
  password: String = '';
  confirmPassword: String = '';
  user: User = new User();

  ngOnInit(): void {


  }
  warning = false;
  errorMessage: String;


  constructor(public as: AuthService, public router: Router, private form: FormBuilder) {
    //check whether user is logged in
    var currentUser = firebase.auth().currentUser;
    if (firebase.auth().currentUser) {
      this.router.navigate(['']);
    }
    this.signupForm = form.group({
      'firstName': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+$')])],
      'lastName': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+$')])],
      'email': [null, Validators.compose([Validators.required,Validators.pattern('^[a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,15})$')])],
      'password': [null, Validators.required],
      'confirmPassword': [null, Validators.required],
      'validate': ''
    },{validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});
  }
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }


  signupWithEmail(email, password, repPassword,firstName,lastName) {
    if (password === repPassword) {
      this.as.signup(email, password,'client',firstName,lastName);
      this.as.loginWithEmail(email, password);
      this.router.navigate(['dashboard']);
    }
  }


  signUpWithGmail() {
    this.as.loginWithGoogle().then((res) => {
      this.router.navigate(['']);
    })
  }

  signUpWithFacebook() {
    this.as.loginWithFacebook().then((res) => {
      this.router.navigate(['']);
    })
  }
}



