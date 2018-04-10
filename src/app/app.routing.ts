import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core/src/metadata/ng_module';

// Import Containers
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
import {InboxComponent} from './views/inbox/inbox.component';
import {MyProfileComponent} from './views/my-profile/my-profile.component';
import {MyProjectsComponent} from './views/my-projects/my-projects.component';
import {PendingProjectsComponent} from './views/pending-projects/pending-projects.component';


export const appRoutes: Routes = [

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
  {path: 'inbox', component: InboxComponent, canActivate: [AuthGuard]},
  {path: 'profile/:id', component: ProfileComponent},
  {path: '', component: ExploreComponent},
  {path: 'explore', component: ExploreComponent},
  {path: 'searchResult/:category', component: SearchResultComponent},
  {path: 'myProfile', component: MyProfileComponent},
  {path: 'myProjects', component: MyProjectsComponent},
  {path: 'projects/pending', component: PendingProjectsComponent},
  {path: '**', component: PageNotFoundComponent}

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
