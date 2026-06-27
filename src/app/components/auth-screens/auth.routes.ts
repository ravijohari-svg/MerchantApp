import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Splash } from './splash/splash';
import { Welcome } from './welcome/welcome';

export const AUTH_ROUTES: Routes = [
    {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    component: Splash
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'welcome',
    component: Welcome
  }
];