import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {User} from './user.model';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';

// import {,FirebaseListObservable} from 'angularfire2/database-deprecated';

@Injectable()
export class UserService {
  database = firebase.database();
  private basePath: string = 'user';
  isSetup: Boolean;
  userExist: Boolean;
  query = firebase.database().ref('user');
  searchResult = [];
  tempSearchResult = [];
  userList: AngularFireList<any>;
  user: User = new User();
  searchWord: String;


  // user: Observable<User>;

  constructor(private db: AngularFireDatabase) {
    this.isSetup = false;
  }

  persistUser(user: User): void {
    const uList = this.db.list('user');

    uList.push({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      uid: user.uid,
      email: user.email,
      phone: user.phone,
      photoUrl: user.photoUrl
    });


  }

  findUserByEmail(email) {
    var user;
    this.userExist = false;
    this.query.orderByChild('email').equalTo(email).on('child_added', function (snap) {
      user = snap;
    })
    return user;
  }

  checkUserRole(email) {

    return this.query.orderByChild('email').equalTo(email);

  }
  getCurrentUserInfo(uid) {
    return this.query.orderByChild('uid').equalTo(uid);
  }
  //
  // findPro(category, finderAddress) {
  //   this.query.orderByChild('category')
  //     .equalTo(category)
  //     .on('child_added', function (snap) {
  //       var user = snap.val();
  //       if (user.address == finderAddress) {
  //         return this.searchResult.push(user);
  //       }
  //       else {
  //         alert('no result');
  //       }
  //     }).bind(this);
  // }



  // setAllResult(results){
  //   this.searchResult = results;
  //
  //   console.log("results in service");
  //   console.log(this.searchResult);
  //   this.getAllResult();
  // }
  //
  // getAllResult(){
  //   console.log('this is getter');
  //   console.log(this.searchResult);
  //   return this.searchResult;
  // }
}
