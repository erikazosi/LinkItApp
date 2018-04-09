import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../providers/authentication/auth.service';
import {UserService} from '../../model/user/user.service';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {User} from '../../model/user/user.model';

@Component({
  selector: 'app-sign-up-pro',
  templateUrl: './sign-up-pro.component.html',
  styleUrls: ['./sign-up-pro.component.scss']
})
export class SignUpProComponent implements OnInit {
  user: User = new User();

  repPassword: '';
  addressList = [];
  address: String;
  categories = [];
  category: String;

  userList: AngularFireList<any>;

  constructor(private as: AuthService,
              private db: AngularFireDatabase,
              private router: Router,
              private userService: UserService) {
    this.getAddress();
    this.getCategories();
  }

  ngOnInit() {

    // this.getAllAddress();
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

        this.as.loginWithEmail(email, password).then((res) => {
          this.router.navigate(['profile/dashboard']);
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
        'dob': this.user.dob,
        'category': this.user.category,
        'country': 'Nepal',
        'city': this.user.city,
        'role': 'pro',
        'uid': currentUser.uid

      }
    ).then((res) => {

      firebase.database().ref('schedule/' + currentUser.uid).set({
        'Sunday': {
          'from': '10:00',
          'to': '5:00'
        },
        'Monday': {
          'from': '10:00',
          'to': '5:00'
        },
        'Tuesday': {
          'from': '10:00',
          'to': '5:00'
        },
        'Wednesday': {
          'from': '10:00',
          'to': '5:00'
        },
        'Thursday': {
          'from': '10:00',
          'to': '5:00'
        },
        'Friday': {
          'from': '10:00',
          'to': '5:00'
        },
        'Saturday': {
          'from': '10:00',
          'to': '5:00'
        }
        //some more user data
      });

    });

  }


  // getLocation() {
  //   console.log('geoLoacation');
  //   navigator.geolocation.getCurrentPosition(this.getAddressFromLatLang);
  //
  // }
  //
  // getAddressFromLatLang(position) {
  //        var geoCoder = new GoogleMaps.Geocoder();
  //
  //     var latLng = new GoogleMaps.LatLng(position.coords.longitude, position.coords.latitude);
  //     geoCoder.geocode({'latLng': latLng}, function (results, status) {
  //       console.log('After getting address');
  //       console.log(results);
  //       if (status == GoogleMaps.GeocoderStatus.OK) {
  //         if (results[1]) {
  //           console.log(results[1]);
  //           alert(results[1].formatted_address);
  //         }
  //       } else {
  //         alert('Geocode was not successful for the following reason: ' + status);
  //       }
  //     });
  //
  //
  //
  //   console.log('Entering getAddressFromLatLang()');
  // }


  // getAllAddress() {
  //   var addresses = firebase.database().ref().child('address');
  //   addresses.on('value', ((res) => {
  //     this.cityList = [];
  //     res.forEach(this.cityList.push(res.val()))
  //     }))
  // }
}
