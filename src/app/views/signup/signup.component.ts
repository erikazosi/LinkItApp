import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../providers/authentication/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email: String;
  password: String;
  repPassword: String;
  firstName: String;
  lastName: String;
  warning = false;
  errorMessage: String;

  constructor(public as: AuthService, public router: Router) {

  }

  ngOnInit() {
  }

  signupWithEmail(email, password, repPassword, firstName, lastName) {
    if (password === repPassword) {
      console.log(password)
      console.log(repPassword)
      this.as.signup(email, password).then(function (result) {
        this.router.navigate['dashboard'];
      })
        .catch(function (error) {
          this.warning = true;
          // Handle Errors here.
          var errorCode = error.code;
          this.errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });


    }
  }


}
