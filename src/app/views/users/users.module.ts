import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaginationModule} from 'ngx-bootstrap';
import {UsersRoutingModule} from './users-routing.module';
import {UserComponent} from './user/user.component';
import {UserListComponent} from './user-list.component';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    UsersRoutingModule
  ],
  declarations: [UserComponent,
    UserListComponent
  ]
})
export class UsersModule { }
