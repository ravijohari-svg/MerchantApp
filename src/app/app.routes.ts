import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
// import { Splash } from './components/auth-screens/splash/splash';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('./components/auth-screens/auth.routes')
        .then(m => m.AUTH_ROUTES)
  },

  {
    path: 'merchant',
    // canActivate: [authGuard],
    loadChildren: () =>
      import('./components/merchant/merchant.routes')
        .then(m => m.MERCHANT_ROUTES)
  },

  {
    path: 'store',
    // canActivate: [authGuard],
    loadChildren: () =>
      import('./components/store-manager/store-manager.routes')
        .then(m => m.STORE_ROUTES)
  },
  {
    path: 'inventory',
    // canActivate: [authGuard],
    loadChildren: () =>
      import('./components/inventory-layout/inventory-layout.routes')
        .then(m => m.INVENTORY_ROUTES)
  },
 {
    path: 'staff',
    // canActivate: [authGuard],
    loadChildren: () =>
      import('./components/staff-layout/staff-layout.routes')
        .then(m => m.STAFF_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];