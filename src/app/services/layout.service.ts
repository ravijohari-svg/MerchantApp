import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isSidebarOpen = signal(typeof window !== 'undefined' ? window.innerWidth >= 992 : true);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  openSidebar() {
    this.isSidebarOpen.set(true);
  }
}
