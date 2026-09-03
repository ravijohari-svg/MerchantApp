import { Routes } from '@angular/router';
import { roleGuard } from '../../guards/role.guard';
import { StoreLayout } from './store-layout';

export const  STORE_ROUTES: Routes = [
{
      path: '',
    component: StoreLayout,
    // canActivate: [roleGuard],
    data: {
      roles: ['StoreManager']
    },
    children: [
      {
        path: '',
        redirectTo: 'store-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'store-dashboard',
        loadComponent: () =>
          import('./store-dashboard/store-dashboard')
            .then(m => m.StoreDashboard)
      }
    ]
  
}
  
];