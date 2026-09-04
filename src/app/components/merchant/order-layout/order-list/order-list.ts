import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MerchantService } from '../../../../services/merchant.service';

interface Order {
  id: string;
  customer: string;
  store: string;
  items: number;
  amount: number;
  payment: string;
  status: 'Pending' | 'Accepted' | 'Preparing' | 'In Transit' | 'Delivered' | 'Cancelled';
  drone: string;
  time: string;
}

@Component({
  selector: 'app-order-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})

export class OrderList implements OnInit {
  // Top Overview Metrics
  metrics = {
    today: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0
  };

  tabs: string[] = ['All Orders', 'Pending', 'Accepted', 'Preparing', 'In Transit', 'Delivered', 'Cancelled'];
  selectedTab: string = 'All Orders';
  currentSearchTerm: string = '';

  displayedColumns: string[] = ['id', 'customer', 'store', 'items', 'amount', 'payment', 'status', 'drone', 'time', 'actions'];

  masterOrderData: Order[] = [
    // { id: 'ORD-7841', customer: 'Priya Sharma', store: 'KFC - Sector 55', items: 3, amount: 847, payment: 'Paid', status: 'Delivered', drone: 'S1-DR-014', time: '2 min ago' },
    // { id: 'ORD-7840', customer: 'Arjun Mehta', store: 'MedPlus - DLF Phase 3', items: 1, amount: 420, payment: 'Unpaid', status: 'In Transit', drone: 'S1-DR-007', time: '8 min ago' },
    // { id: 'ORD-7839', customer: 'Sneha Gupta', store: 'D-Mart - Sector 29', items: 7, amount: 2340, payment: 'Paid', status: 'Preparing', drone: '—', time: '15 min ago' },
    // { id: 'ORD-7838', customer: 'Rohit Verma', store: 'KFC - Cyber Hub', items: 2, amount: 650, payment: 'Paid', status: 'Pending', drone: '—', time: '22 min ago' },
    // { id: 'ORD-7837', customer: 'Anjali Singh', store: 'Samsung - Sector 55', items: 1, amount: 12999, payment: 'Paid', status: 'Delivered', drone: 'S1-DR-003', time: '34 min ago' },
    // { id: 'ORD-7836', customer: 'Vikash Kumar', store: 'MedPlus - Cyber Hub', items: 4, amount: 890, payment: 'Paid', status: 'Cancelled', drone: '—', time: '45 min ago' },
    // { id: 'ORD-7835', customer: 'Meera Pillai', store: 'D-Mart - Sector 29', items: 12, amount: 4230, payment: 'Paid', status: 'Delivered', drone: 'S1-DR-009', time: '52 min ago' },
    // { id: 'ORD-7834', customer: 'Rahul Jain', store: 'D-Mart - Sector 29', items: 5, amount: 1870, payment: 'Paid', status: 'Delivered', drone: 'S1-DR-011', time: '1 hr ago' }
  ];

  dataSource = new MatTableDataSource<Order>(this.masterOrderData);
  isLoading = true;

  constructor(private merchantService: MerchantService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Order, filter: string) => {
      let searchParams: any = { status: 'all orders', search: '' };
      try {
        searchParams = JSON.parse(filter);
      } catch (e) {
        searchParams = { status: 'all orders', search: filter };
      }
      
      let matchStatus = true;
      if (searchParams.status !== 'all orders') {
        matchStatus = data.status.toLowerCase() === searchParams.status;
      }

      let matchSearch = true;
      if (searchParams.search) {
        const searchStr = searchParams.search;
        matchSearch = 
          data.id.toLowerCase().includes(searchStr) ||
          data.customer.toLowerCase().includes(searchStr) ||
          data.store.toLowerCase().includes(searchStr) ||
          data.status.toLowerCase().includes(searchStr);
      }

      return matchStatus && matchSearch;
    };
    
    this.applyFilters();
    this.fetchOrders();
  }

  fetchOrders(): void {
    let merchantId = 'MERC-98765';
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parsedToken = JSON.parse(token);
        merchantId = parsedToken?.merchantBrand?.MerchantId || parsedToken.merchantId || parsedToken.MerchantId || parsedToken.id || 'MERC-98765';
      }
    } catch (e) {
      console.warn('Could not parse token from localStorage');
    }

    this.merchantService.getMerchantOrders({ MerchantId: merchantId }).subscribe({
      next: (response: any) => {
        let res = response;
        if (typeof response === 'string') {
          res = JSON.parse(response);
        } else if (response && response.body && typeof response.body === 'string') {
          res = JSON.parse(response.body);
        } else if (response && response.body && typeof response.body === 'object') {
          res = response.body;
        }

        // Adjust based on the actual API response format if it differs
        const data = res?.orders || res?.data || res;

        if (Array.isArray(data)) {
          this.masterOrderData = data.map((item: any) => {
            // Calculate total items from Qty
            let totalItems = 0;
            if (item.Items && Array.isArray(item.Items)) {
              totalItems = item.Items.reduce((acc: number, curr: any) => acc + (curr.Qty || 1), 0);
            } else {
              totalItems = item.items || item.ItemsCount || item.itemsCount || 0;
            }

            // Map status
            let statusStr = 'Pending';
            const apiStatus = (item.OrderStatus || item.status || '').toUpperCase();
            if (apiStatus === 'PENDING' || apiStatus === 'CREATED') statusStr = 'Pending';
            else if (apiStatus === 'ACCEPTED') statusStr = 'Accepted';
            else if (apiStatus === 'PREPARING') statusStr = 'Preparing';
            else if (apiStatus === 'IN TRANSIT') statusStr = 'In Transit';
            else if (apiStatus === 'DELIVERED') statusStr = 'Delivered';
            else if (apiStatus === 'CANCELLED') statusStr = 'Cancelled';

            // Format time
            let timeAgo = item.time || item.OrderTime || item.orderTime || 'Just now';
            if (item.TS_Created) {
              const orderDate = new Date(item.TS_Created);
              const now = new Date();
              const diffMs = now.getTime() - orderDate.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              if (diffMins < 60) {
                timeAgo = `${Math.max(0, diffMins)} min ago`;
              } else if (diffHours < 24) {
                timeAgo = `${diffHours} hr ago`;
              } else {
                timeAgo = orderDate.toLocaleDateString();
              }
            }

            return {
              id: item.OrderId || item.id || item.orderId || 'N/A',
              customer: item.Customer?.Name || item.customer || item.CustomerName || item.customerName || 'N/A',
              store: item.Store?.StoreName || item.store || item.StoreName || item.storeName || 'N/A',
              items: totalItems,
              amount: item.FinalAmount || item.amount || item.TotalAmount || item.totalAmount || 0,
              payment: item.Payment?.PaymentStatus || item.payment || item.PaymentStatus || item.paymentStatus || 'N/A',
              status: statusStr as 'Pending' | 'Accepted' | 'Preparing' | 'In Transit' | 'Delivered' | 'Cancelled',
              drone: item.DroneId || item.drone || item.droneId || '—',
              time: timeAgo
            };
          });
          this.dataSource.data = this.masterOrderData;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.applyFilters();
  }

  applySearch(event: Event): void {
    this.currentSearchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    this.dataSource.filter = JSON.stringify({
      status: this.selectedTab.toLowerCase(),
      search: this.currentSearchTerm
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}