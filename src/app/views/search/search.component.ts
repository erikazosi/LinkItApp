import {Component, Inject, OnInit} from '@angular/core';
// import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase/app';
import {UserService} from '../../model/user/user.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [UserService]

})
export class SearchComponent implements OnInit {

  searchWord: String;
  searchResult = [];
  showList: Boolean = false;
  categories = [];
  categoryLoaded: Boolean = true;
  constructor(@Inject(UserService) private userSvc: UserService, private router: Router) {
    this.getCategories()
  }

  ngOnInit() {
  }

  search() {
    this.router.navigate(['searchResult',this.searchWord]);
  }
  getCategories() {
    firebase.database().ref('Category').on('child_added', (data) => {
      if (data.val().parentId != 0) {
        data.forEach((res) => {
          this.categories.push(data.val().name);

          this.categoryLoaded = false;
          console.log('categories fetched>');

          return true;
        })
      }
    });
  }
// }
//   findPro() {
//     var user = firebase.auth().currentUser;
//     if (user) {
//       this.userSvc.getCurrentUserInfo(user.uid).on('child_added', (function (snap) {
//
//         if (snap.val().address == '') {
//           this.findProWOAddress(this.searchWord);
//         }
//         else {
//           this.findProf(this.searchWord, snap.val().address);
//           this.router.navigate(['searchResult']);
//         }
//
//
//       }).bind(this))
//     }
//     else {
//       var data = this.findProWOAddress(this.searchWord);
//       this.searchResult.push(data);
//       this.userSvc.setAllResult(this.searchResult);
//       // this.searchRes.getResult(this.searchResult);
//       this.router.navigate(['searchResult']);
//
//     }
//   }
//
//   findProf(category, finderAddress) {
//     firebase.database().ref('user').orderByChild('category')
//       .equalTo(category)
//       .on('child_added', function (snap) {
//         var user = snap.val();
//         if (user.address == finderAddress) {
//           return this.searchResult.push(user);
//         }
//         else {
//           alert('no result');
//         }
//       }).bind(this);
//   }
//
//
//   findProWOAddress(category) {
//     firebase.database().ref('user').orderByChild('category')
//       .equalTo(category)
//       .on('value').then(function (snap) {
//       return snap.val();
//
//
//     })
//
//   }


  showCategories() {
    this.showList = true;
  }
}
