import { Routes } from '@angular/router';
import { MerchantLayout } from './merchant-layout';

export const MERCHANT_ROUTES: Routes = [
    {
    path: '',
    component: MerchantLayout,
    // canActivate: [roleGuard],
    data: {
      roles: ['Merchant']
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard')
            .then(m => m.Dashboard)
      }
    ]
  }
];