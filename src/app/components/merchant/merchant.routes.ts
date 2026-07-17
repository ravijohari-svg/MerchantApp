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
      },
      {
        path: 'store-management',
        loadComponent: () =>
          import('./store-management/store-management')
            .then(m => m.StoreManagement)
      },
      {
        path: 'add-store',
        loadComponent: () =>
          import('./add-store/add-store')
            .then(m => m.AddStore)
      },
        {
        path: 'products',
        loadComponent: () =>
          import('./product-layout/product-layout').then(
            m => m.ProductLayout
          ),
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./product-layout/product-list/product-list').then(
                m => m.ProductList
              )
          },
          {
            path: 'add-product',
            loadComponent: () =>
              import('./product-layout/add-product/add-product').then(
                m => m.AddProduct
              )
          }

           // {
          //   path: 'edit/:id',
          //   loadComponent: () =>
          //     import('./product-layout/edit-product/edit-product').then(
          //       m => m.EditProduct
          //     )
          // }
        ]
      }
         
          
    ]
  }
];