import { Component, inject, HostBinding } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
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
    { name: 'Dashboard', icon: 'pi pi-th-large', route: '/merchant/dashboard' },
    { name: 'Store Management', icon: 'pi pi-sliders-h', route: '/merchant/store-management' },
    { name: 'Products', icon: 'pi pi-box', route: '/merchant/products' },
    { name: 'Orders', icon: 'pi pi-shopping-cart', badge: 18, route: '/merchant/orders' },
    // { name: 'Promotions', icon: 'pi pi-percentage', route: '/merchant/promotions' },
    { name: 'Team', icon: 'pi pi-users', route: '/merchant/team' },
    { name: 'Notifications', icon: 'pi pi-bell', badge: 5, route: '/merchant/notifications' },
    { name: 'Settings', icon: 'pi pi-cog', route: '/merchant/settings' },
  ];

  constructor(private router: Router) {
    this.setActiveItemFromRoute(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.setActiveItemFromRoute(event.urlAfterRedirects);
      });
  }

  isActive(item: { name: string }) {
    return this.activeItem === item.name;
  }

  setActiveItemFromRoute(url: string): void {
    const normalizedUrl = url.split('?')[0].split('#')[0];
    const matchedItem = this.menuItems.find(
      (item) => normalizedUrl === item.route || normalizedUrl.startsWith(`${item.route}/`),
    );

    this.activeItem = matchedItem?.name ?? 'Dashboard';
  }

  selectItem(item: { name: string; route?: string }) {
    this.activeItem = item.name;

    if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}
