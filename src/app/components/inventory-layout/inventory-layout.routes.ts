import { Routes } from '@angular/router';
import { roleGuard } from '../../guards/role.guard';
import { InventoryLayout } from '../inventory-layout/inventory-layout';

export const  INVENTORY_ROUTES: Routes = [
{
      path: '',
    component: InventoryLayout,
    // canActivate: [roleGuard],
    data: {
      roles: ['InventoryManager']
    },
    children: [
      {
        path: '',
        redirectTo: 'inventory-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'inventory-dashboard',
        loadComponent: () =>
          import('./inventory-dashboard/inventory-dashboard')
            .then(m => m.InventoryDashboard)
      }
    ]
  
}
  
];