import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from './providers/authentication/auth.service';
import {ModalModule} from 'ngx-bootstrap/modal';
//firebases
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
//router
import {AppRoutingModule} from './app.routing';

import {AppComponent} from './app.component';
// Import components(bootstrap)
import {AppFooterComponent, AppHeaderComponent} from './components';
// Import 3rd party components
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {CollapseModule} from 'ngx-bootstrap';
//importing views
import {LoginComponent} from './views/login/login.component';
import {SignupComponent} from './views/signup/signup.component';
import {environment} from '../environments/environment';
import {AuthGuard} from './providers/authentication/auth.guard';
import {UserService} from './model/user/user.service';
import {SignUpProComponent} from './views/sign-up-pro/sign-up-pro.component';
import {StorageServiceModule} from 'angular-webstorage-service';


import {ProjectsComponent} from './views/projects/projects.component';
import {ProfileComponent} from './views/profile/profile.component';
import {ExploreComponent} from './views/explore/explore.component';
import {SearchComponent} from './views/search/search.component';
import {SearchResultComponent} from './views/search-result/search-result.component';
import {InboxComponent} from './views/inbox/inbox.component';
import {SpinnerComponent} from './ui/spinner/spinner.component';
import {MyProfileComponent} from './views/my-profile/my-profile.component';
import {ProjectNavComponent} from './views/project-nav/project-nav.component';
import {MyProjectsComponent} from './views/my-projects/my-projects.component';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {UserStatusComponent} from './views/user-status/user-status.component';
import {AngularFireDatabaseModule as afd} from 'angularfire2/database-deprecated';
// import {GoogleMapComponent} from './views/google-map/google-map.component';
import {PendingProjectsComponent} from './views/pending-projects/pending-projects.component';
import {AgmCoreModule} from '@agm/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {Ng2OrderModule} from 'ng2-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';

const APP_COMPONENTS = [

  AppFooterComponent,
  AppHeaderComponent]


////////
@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    BrowserModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AgmCoreModule.forRoot({apiKey: environment.googleMapsKey}),
    ModalModule.forRoot(),
    afd,
    StorageServiceModule,
    CollapseModule.forRoot(),
    AngularFireStorageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBNr4fXzeu9dIHYMhpfJwNaxFREya7VUzs'
    })
  ],
  declarations: [
    AppComponent,
    ...APP_COMPONENTS,
    LoginComponent,
    SignupComponent,
    PageNotFoundComponent,
    SignUpProComponent,

    ProjectsComponent,
    ProfileComponent,
    ExploreComponent,
    SearchComponent,
    SearchResultComponent,
    InboxComponent,
    SpinnerComponent,
    MyProfileComponent,
    ProjectNavComponent,
    MyProjectsComponent,
    UserStatusComponent,
    // GoogleMapComponent,
    PendingProjectsComponent],
  providers: [
    AuthService,
    UserService,
    AuthGuard,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
