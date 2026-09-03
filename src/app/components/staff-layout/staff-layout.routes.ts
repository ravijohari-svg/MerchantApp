import { Routes } from '@angular/router';
import { roleGuard } from '../../guards/role.guard';
import { StaffLayout } from './staff-layout';

export const  STAFF_ROUTES: Routes = [
{
      path: '',
    component: StaffLayout,
    // canActivate: [roleGuard],
    data: {
      roles: ['StaffLayout']
    },
    children: [
      {
        path: '',
        redirectTo: 'staff-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'staff-dashboard',
        loadComponent: () =>
          import('./staff-dashboard/staff-dashboard')
            .then(m => m.StaffDashboard)
      },
    ]
  
}
  
];