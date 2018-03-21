import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {User} from './user.model';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';

// import {,FirebaseListObservable} from 'angularfire2/database-deprecated';

@Injectable()
export class UserService {
  database = firebase.database();
  private basePath: string = '/users';

  userList: AngularFireList<any>;

  // user: Observable<User>;

  constructor(private db: AngularFireDatabase) {
  }

  persistUser(user: User): void {
    const uList = this.db.list('user');
    uList.push({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      uid: user.uid
    });


  }

  findUserByEmail(email) {
    //http://bighow.org/42130302-Check_if_user_exists_and_store_his_data_with_Firebase_Angular_Facebook.html
   return firebase.database().ref('users/email');

  }


}
