import {Component, Inject, Input, OnInit} from '@angular/core';
import {UserService} from '../../model/user/user.service';
import {User} from '../../model/user/user.model';
import * as firebase from 'firebase/app';
import {ActivatedRoute, Router} from '@angular/router';
import * as geocoder from 'geocoder';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [UserService]

})
export class SearchResultComponent implements OnInit {
  user: User = new User();
  fullName: String;
  address: String;
  bio: String;
  photoUrl: String;
  category: String;
  searchWord: String;
  searchResult = [];
  filter: any;

  private basePath: string = 'user';
  query = firebase.database().ref('user');
  private sub: any;
  loadSpinner: boolean = true;

  constructor(@Inject(UserService) private userSvc: UserService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.searchWord = params['category'];
    })
    this.findPro();

  }


  //toggle button of review and rating
  isCollapsed: boolean = true;

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  findPro() {
    var user = firebase.auth().currentUser;
    if (user) {
      this.userSvc.getCurrentUserInfo(user.uid).on('child_added', (function (snap) {

        if (snap.val().address == '') {
          this.findProWOAddress(this.searchWord);
        }
        else {
          this.findProf(this.searchWord, snap.val().address);
        }


      }).bind(this))
    }
    else {
      this.findProWOAddress(this.searchWord);
      // this.searchRes.getResult(this.searchResult);

    }
  }

  findProf(category, finderAddress) {
    this.query.orderByChild('category')
      .startAt(category)
      .on('child_added', (function (snap) {
        var user = snap.val();
        if (user.address) {
          if (user.address == finderAddress)
            this.searchResult.push(user);
          this.loadSpinner = false;

        }
        else {
          // alert(category);
          this.findProWOAddress(category);
        }
      }).bind(this));
  }


  findProWOAddress(category) {
    // alert(category);
    var geocode;
    this.query.orderByChild('category')
      .equalTo(category)
      .on('child_added', (function (snap) {
        // Setting sensor to true
        geocoder.reverseGeocode( snap.val().city.lati,snap.val().city.longi, (function ( err, data ) {
          geocode = data.results[0].formatted_address;
          this.searchResult.push({_key: snap.key,address:geocode, ...snap.val()});


        }).bind(this));


      }).bind(this));
    this.loadSpinner = false;

  }


  loadProfile(key: any) {
    this.router.navigate(['profile', key]);
  }
}
