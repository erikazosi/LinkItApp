import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';

// Import Containers
import {
  FullLayoutComponent
} from './containers';
import {LoginComponent} from './views/login/login.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {SignupComponent} from './views/signup/signup.component';
import { AuthGuard } from './providers/authentication/auth.guard';


export const appRoutes: Routes = [

  {path: '',component: LoginComponent},
  {
  path: 'dashboard',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate: [AuthGuard]
  },
  {path: 'login',component: LoginComponent},
  {path: 'signup',component: SignupComponent},
  {path: '**',component: PageNotFoundComponent}
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
