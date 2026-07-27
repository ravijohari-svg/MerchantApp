import { Routes } from '@angular/router';
import { MerchantLayout } from './merchant-layout';

export const MERCHANT_ROUTES: Routes = [
  {
    path: '',
    component: MerchantLayout,
    // canActivate: [roleGuard],
    data: {
      roles: ['Merchant'],
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'store-management',
        loadComponent: () =>
          import('./store-management/store-management').then((m) => m.StoreManagement),
      },
      {
        path: 'add-store',
        loadComponent: () => import('./add-store/add-store').then((m) => m.AddStore),
      },
      {
        path: 'products',
        loadComponent: () => import('./product-layout/product-layout').then((m) => m.ProductLayout),
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./product-layout/product-list/product-list').then((m) => m.ProductList),
          },
          {
            path: 'add-product',
            loadComponent: () =>
              import('./product-layout/add-product/add-product').then((m) => m.AddProduct),
          },

          // {
          //   path: 'edit/:id',
          //   loadComponent: () =>
          //     import('./product-layout/edit-product/edit-product').then(
          //       m => m.EditProduct
          //     )
          // }
        ],
      },

      {
        path: 'orders',
        loadComponent: () => import('./order-layout/order-layout').then((m) => m.OrderLayout),
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./order-layout/order-list/order-list').then((m) => m.OrderList),
          },
          {
            path: 'view-orders',
            loadComponent: () =>
              import('./order-layout/view-orders/view-orders').then((m) => m.ViewOrders),
          },
          // {
          //   path: 'edit/:id',
          //   loadComponent: () =>
          //     import('./order-layout/edit-order/edit-order').then(
          //       m => m.EditOrder
          //     )
          // }
        ],
      },
      {
        path: 'team',
        loadComponent: () => import('./team-layout/team-layout').then((m) => m.TeamLayout),
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./team-layout/team-list/team-list').then((m) => m.TeamList),
          },
          {
            path: 'add-member',
            loadComponent: () =>
              import('./team-layout/add-member/add-member').then((m) => m.AddMember),
          },
        ],
      },
      {
        path: 'notifications',
        loadComponent: () => import('./notifications/notifications').then((m) => m.Notifications),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then((m) => m.Settings),
      },
    ],
  },
];
