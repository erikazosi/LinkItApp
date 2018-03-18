import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {User} from './user.model';
import {Observable} from 'rxjs/Observable';

// import {,FirebaseListObservable} from 'angularfire2/database-deprecated';

@Injectable()
export class UserService {
  private basePath: string = '/users';

  userList: AngularFireList<any>;
  // user: Observable<User>;

  constructor(private db: AngularFireDatabase) {
  }

  persistUser(user: User): void {
    console.log('persist method');
    const uList = this.db.list('user');
    uList.push({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      uid: user.uid
    });


  }

}
