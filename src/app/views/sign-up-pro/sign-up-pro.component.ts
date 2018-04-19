import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../providers/authentication/auth.service';
import {UserService} from '../../model/user/user.service';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {User} from '../../model/user/user.model';
import {FormBuilder, FormGroup,Validators} from '@angular/forms';
import * as geocoder from 'geocoder';


@Component({
  selector: 'app-sign-up-pro',
  templateUrl: './sign-up-pro.component.html',
  styleUrls: ['./sign-up-pro.component.scss']
})
export class SignUpProComponent implements OnInit {
  user: User = new User();
  signupProForm: FormGroup;
  repPassword: '';
  addressList = [];
  address: String;
  categories = [];
  category: String;
  place: any;
  userList: AngularFireList<any>;
  lati: number;
  longi: number;
  map: google.maps.Map;
  public zoom: number;

  firstName: String = '';
  lastName: String = '';
  phone: Number;
  email: String = '';
  password: String = '';
  confirmPassword: String = '';
  description: String = '';


  constructor(private as: AuthService,
              private db: AngularFireDatabase,
              private router: Router,
              private userService: UserService,
              private form: FormBuilder) {
    this.signupProForm = form.group({
      'firstName': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+$')])],
      'lastName': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+$')])],
      'email': [null, Validators.compose([Validators.required,Validators.pattern('^[a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,15})$')])],
      'phone': [null, Validators.required],
      'password': [null, Validators.required],
      'confirmPassword': [null, Validators.required],
      'address': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      'validate': ''
    },{validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});



    this.getAddress();
    this.getCategories();
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
  ngOnInit() {
    this.zoom = 100;    // this.getAllAddress();
  }

  getAddress() {
    firebase.database().ref('address').on('child_added', (data) => {
      data.val().forEach((res) => {
        this.addressList.push(res.city);
        //console.log(this.addressList);

      });
      this.addressList.sort();

    });

  }

  getCategories() {
    firebase.database().ref('Category').on('child_added', (data) => {
      if (data.val().parentId != 0) {
        data.forEach((res) => {
          this.categories.push(data.val().name);
          console.log('categories fetched>');

          return true;
        })
      }
    });
  }

  signupWithEmail(email, password, repPassword) {
    if (password === repPassword) {
      this.as.signup(email, password, 'pro', '', '').then((res) => {
        geocoder.geocode(this.place + ',Nepal', (err, data) => {
          var geocode = data.results[0].geometry.location;
          this.longi = geocode.lng;
          this.lati = geocode.lat;
          geocoder.reverseGeocode(this.lati, this.longi, (err, data) => {
            this.address = data.results[0].formatted_address;
          })
        });

        this.as.loginWithEmail(email, password).then((res) => {
          var currentUser = firebase.auth().currentUser;
          this.addProToDb(currentUser);

        })

      })
    } else {
      alert('password doesnt match')
    }
  }


  addProToDb(currentUser) {
    const uList = this.db.list('user');

    uList.push({
        'firstName': this.user.firstName,
        'lastName': this.user.lastName,
        'email': this.user.email,
        'phone': this.user.phone,
        'category': this.user.category,
        'country': 'Nepal',
        'city': {
          'longi': this.longi,
          'lati': this.lati,
          'fullAddress': this.address
        },
      'description': this.description,
        'role': 'pro',
        'uid': currentUser.uid

      }

    ).then((res) => {
      this.as.logout();
      this.router.navigate(['/login']);
    });

  }

  search() {
    geocoder.geocode(this.place + ',Nepal', (err, data) => {
      var geocode = data.results[0].geometry.location;
      this.longi = geocode.lng;
      this.lati = geocode.lat;
      geocoder.reverseGeocode(this.lati, this.longi, (err, data) => {
        this.address = data.results[0].formatted_address;
      })
    })


  }


}
