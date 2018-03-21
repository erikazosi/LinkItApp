import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user/user.component';
import {UserListComponent} from './user-list.component';


const userRoutes: Routes = [
  {
    path: '',
    data: {
      title: 'User'
    },
    children: [
      {
        path: 'add',
        component: UserComponent,
        data: {
          title: 'Add Users'

        }
      },

      {
        path: 'list',
        component: UserListComponent,

        data: {
          title: 'User List'

        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})

export class UsersRoutingModule {
}
