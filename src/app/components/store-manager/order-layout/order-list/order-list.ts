import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

interface Order {
  id: string;
  customer: string;
  store: string;
  items: number;
  amount: number;
  payment: string;
  status: 'Pending' | 'Preparing' | 'In Transit' | 'Delivered' | 'Cancelled';
  drone: string;
  time: string;
}

@Component({
  selector: 'app-order-list',
  imports: [
    CommonModule,   
    MatTableModule,  
    MatIconModule,
    RouterLink
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})

export class OrderList implements OnInit {
  // Top Overview Metrics
  metrics = {
    today: 8,
    pending: 5,
    preparing: 12,
    ready: 3,
    completed: 18,
    cancelled: 166
  };

  tabs: string[] = ['All Orders', 'Pending', 'Preparing', 'In Transit', 'Delivered', 'Cancelled'];
  selectedTab: string = 'All Orders';

  displayedColumns: string[] = ['id', 'customer', 'store', 'items', 'amount', 'payment', 'status', 'drone', 'time', 'actions'];
  
  masterOrderData: Order[] = [
    { id: 'ORD-7841', customer: 'Priya Sharma', store: 'KFC - Sector 55', items: 3, amount: 847, payment: 'Paid', status: 'Delivered', drone: 'S1-DR-014', time: '2 min ago' },
    { id: 'ORD-7840', customer: 'Arjun Mehta', store: 'MedPlus - DLF Phase 3', items: 1, amount: 420, payment: 'Unpaid', status: 'In Transit', drone: 'S1-DR-007', time: '8 min ago' },
    { id: 'ORD-7839', customer: 'Sneha Gupta', store: 'D-Mart - Sector 29', items: 7, amount: 2340, payment: 'Paid', status: 'Preparing', drone: '—', time: '15 min ago' },
    { id: 'ORD-7838', customer: 'Rohit Verma', store: 'KFC - Cyber Hub', items: 2, amount: 650, payment: 'Paid', status: 'Pending', drone: '—', time: '22 min ago' },
    { id: 'ORD-7837', customer: 'Anjali Singh', store: 'Samsung - Sector 55', items: 1, amount: 12999, payment: 'Paid', status: 'Delivered', drone: 'S1-DR-003', time: '34 min ago' },
    { id: 'ORD-7836', customer: 'Vikash Kumar', store: 'MedPlus - Cyber Hub', items: 4, amount: 890, payment: 'Paid', status: 'Cancelled', drone: '—', time: '45 min ago' },
    { id: 'ORD-7835', customer: 'Meera Pillai', store: 'D-Mart - Sector 29', items: 12, amount: 4230, payment: 'Paid', status: 'Delivered', drone: 'S1-DR-009', time: '52 min ago' },
    { id: 'ORD-7834', customer: 'Rahul Jain', store: 'D-Mart - Sector 29', items: 5, amount: 1870, payment: 'Paid', status: 'Delivered', drone: 'S1-DR-011', time: '1 hr ago' }
  ];

  dataSource = new MatTableDataSource<Order>(this.masterOrderData);

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Order, filter: string) => {
      if (filter === 'all orders') return true;
      return data.status.toLowerCase() === filter;
    };
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.dataSource.filter = tab.toLowerCase();
  }

  applySearch(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}