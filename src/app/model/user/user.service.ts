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
 query = firebase.database().ref('user');

  userList: AngularFireList<any>;

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
      email: user.email
    });


  }

  findUserByEmail(email) {
    //http://bighow.org/42130302-Check_if_user_exists_and_store_his_data_with_Firebase_Angular_Facebook.html
    return this.query.orderByChild('email').equalTo(email).on('child_added', function(snap) {
      // var person = snap.val();
      // console.log(person.firstName, person.lastName);
    });
  }

  checkUserRole(email) {
    return  this.query.orderByChild('email').equalTo(email).on('child_added',function(snap){
      var user= snap.val();
       return user.role;
    })

  }
}
