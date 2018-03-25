import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core/src/metadata/ng_module';

// Import Containers
import {
  FullLayoutComponent
} from './containers';
import {LoginComponent} from './views/login/login.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {SignupComponent} from './views/signup/signup.component';
import {AuthGuard} from './providers/authentication/auth.guard';
import {UserComponent} from './views/users/user/user.component';
import {SignUpProComponent} from './views/sign-up-pro/sign-up-pro.component';
import {ProfileComponent} from './views/profile/profile.component';


export const appRoutes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },

    children: [
      {
        path: 'user',
        loadChildren: './views/users/users.module#UsersModule'
      },
      {
        path: 'category',
        loadChildren: 'app/views/category/category.module#CategoryModule'
      }
    ],
    canActivate: [AuthGuard]
  },
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'pro', component: SignUpProComponent},
  {path:'profile/set-up/info', component:ProfileComponent},
  {path: '**', component: PageNotFoundComponent},
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
