import { Routes } from '@angular/router';
import { StoreDashboard } from './store-dashboard/store-dashboard';
import { roleGuard } from '../../guards/role.guard';

export const  STORE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'store',
    pathMatch: 'full'
  },
  {
      path: 'store-dashboard',
      component: StoreDashboard
    },  
    {
      path: 'store-dashboard',
      loadComponent: () =>
        import('./store-dashboard/store-dashboard')
          .then(m => m.StoreDashboard),
      canActivate: [roleGuard],
      data: {
        roles: ['Merchant']
      }
    },
];