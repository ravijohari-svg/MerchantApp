import { Component, inject, HostBinding } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

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
    { name: 'Dashboard', icon: 'pi pi-th-large' },
    { name: 'Store Management', icon: 'pi pi-sliders-h' },
    { name: 'Products', icon: 'pi pi-box' },
    { name: 'Orders', icon: 'pi pi-shopping-cart', badge: 18 },
    { name: 'Promotions', icon: 'pi pi-percentage' },
    { name: 'Team', icon: 'pi pi-users' },
    { name: 'Notifications', icon: 'pi pi-bell', badge: 5 },
    { name: 'Settings', icon: 'pi pi-cog' }
  ];

  selectItem(name: string) {
    this.activeItem = name;
    // this.layoutService.closeSidebar();
  }
}
