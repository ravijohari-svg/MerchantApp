import { Component, inject, HostBinding } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly layoutService = inject(LayoutService);

  @HostBinding('class.open')
  get isOpen() {
    return this.layoutService.isSidebarOpen();
  }

  activeItem = 'Dashboard';

 menuItems = [
  { name: 'Dashboard', icon: 'pi pi-th-large', route: '/dashboard' },
  { name: 'Store Management', icon: 'pi pi-sliders-h', route: '/store-management' },
  { name: 'Products', icon: 'pi pi-box', route: '/products' },
  { name: 'Orders', icon: 'pi pi-shopping-cart', badge: 18, route: '/orders' },
  { name: 'Promotions', icon: 'pi pi-percentage', route: '/promotions' },
  { name: 'Team', icon: 'pi pi-users', route: '/team' },
  { name: 'Notifications', icon: 'pi pi-bell', badge: 5, route: '/notifications' },
  { name: 'Settings', icon: 'pi pi-cog', route: '/settings' }
];

 selectItem(item: any) {
    this.activeItem = item.name;

    if (item.route) {
    this.router.navigate(['/merchant/products']);
  }
  }

   constructor(private router: Router) {}
}
