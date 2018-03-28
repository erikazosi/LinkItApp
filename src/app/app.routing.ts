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
import {CdashboardComponent} from './views/cdashboard/cdashboard.component';
import {PdashboardComponent} from './views/pdashboard/pdashboard.component';
import {ProjectsComponent} from './views/projects/projects.component';
import {ProfileComponent} from './views/profile/profile.component';
import {ExploreComponent} from './views/explore/explore.component';
import {SearchResultComponent} from './views/search-result/search-result.component';


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
  {path: 'proSignup', component: SignUpProComponent},
  {
    path: 'dashboard', component: PdashboardComponent, canActivate: [AuthGuard]
  },
  {
    path: 'cDashboard', component: CdashboardComponent, canActivate: [AuthGuard]
  },
  {path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard]},
  {path: 'profile/:id', component: ProfileComponent},
  {path: 'explore', component: ExploreComponent},
  {path: 'searchResult/:category', component: SearchResultComponent},
  {path: '**', component: PageNotFoundComponent}

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
