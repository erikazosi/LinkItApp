import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../providers/authentication/auth.service';
import {UserService} from '../../model/user/user.service';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {User} from '../../model/user/user.model';


@Component({
  selector: 'app-sign-up-pro',
  templateUrl: './sign-up-pro.component.html',
  styleUrls: ['./sign-up-pro.component.scss'],
})
export class SignUpProComponent implements OnInit {
  user: User = new User();

  addresses: Array<any>;
  repPassword: '';
  cityList;
  userList: AngularFireList<any>;

  constructor(private as: AuthService, private db: AngularFireDatabase, private router: Router, private userService: UserService) {
    // this.getAllAddress();

  }

  ngOnInit() {
    // this.getAllAddress();
  }

  signupWithEmail(email, password, repPassword) {
    if (password === repPassword) {
      this.as.signup(email, password, 'pro').then((res)=> {


      })
    } else {
      alert('password doesnt match')
    }
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
