import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { roleGuard } from '../../guards/role.guard';

export const MERCHANT_ROUTES: Routes = [
  
   {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard')
        .then(m => m.Dashboard),
    // canActivate: [roleGuard],
    data: {
      roles: ['Merchant']
    }
  },
];